import { diff } from 'deep-diff';
import {
  Client,
  Collection,
  Create,
  Expr,
  Get,
  Index,
  Match,
  Paginate,
  Ref,
  Update,
  values,
} from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import isEqual from 'lodash.isequal';
import { setRecoilExternalState } from '../components/RecoilExternalStatePortal';
import { getClient } from '../lib/faunadb/faunadb';
import { canvasDatasetSelector } from '../states/canvasDatasetSelector';
import { UserSession } from '../types/auth/UserSession';
import { CanvasDataset } from '../types/CanvasDataset';
import { Canvas } from '../types/faunadb/Canvas';
import { CanvasByOwnerIndex } from '../types/faunadb/CanvasByOwnerIndex';
import { CanvasResult } from '../types/faunadb/CanvasResult';
import {
  OnInit,
  OnStart,
  OnUpdate,
} from '../types/faunadb/CanvasStream';
import { FaunadbStreamVersionEvent } from '../types/faunadb/FaunadbStreamVersionEvent';

type TypeOfRef = values.Ref;

const PUBLIC_SHARED_FAUNABD_TOKEN = process.env.NEXT_PUBLIC_SHARED_FAUNABD_TOKEN as string;
const SHARED_CANVAS_DOCUMENT_ID = '1';

export const getUserClient = (user: UserSession | null): Client => {
  const secret = user?.faunaDBToken || PUBLIC_SHARED_FAUNABD_TOKEN;

  return getClient(secret);
};

/**
 * Starts the real-time stream between the browser and the FaunaDB database, on a specific record/document.
 *
 * @param user
 * @param onStart
 * @param onInit
 * @param onUpdate
 */
export const initStream = async (user: UserSession | null, onStart: OnStart, onInit: OnInit, onUpdate: OnUpdate) => {
  console.log('Init stream for user', user);
  const client: Client = getUserClient(user);
  const canvasRef: Expr | undefined = await findUserCanvasRef(user);

  if (canvasRef) {
    console.log('Working on Canvas document', canvasRef);
    let stream: Subscription;

    const _startStream = async () => {
      console.log(`Stream to FaunaDB is (re)starting for:`, canvasRef);

      stream = client.stream.
        // @ts-ignore
        document(canvasRef)
        .on('start', (at: number) => {
          console.log('Stream started at:', at);
          onStart(stream, canvasRef as TypeOfRef);
        })
        .on('snapshot', (snapshot: CanvasResult) => {
          console.log('snapshot', snapshot);
          onInit(snapshot.data);
        })
        .on('version', (version: FaunadbStreamVersionEvent) => {
          console.log('version', version);

          if (version.action === 'update') {
            onUpdate(version.document.data);
          }
        })
        .on('error', async (error: any) => {
          console.log('Error:', error);
          if (error?.name === 'NotFound') {
            const defaultCanvasDataset: CanvasDataset = {
              nodes: [],
              edges: [],
            };

            console.log('No record found, creating record...');
            const createDefaultRecord = Create(findUserCanvasRef(user), {
              data: defaultCanvasDataset,
            });
            const result: CanvasResult = await client.query(createDefaultRecord);
            console.log('result', result);
            onInit(result?.data);
          } else {
            stream.close();
            setTimeout(_startStream, 1000);
          }
        })
        .on('history_rewrite', (error: any) => {
          console.log('Error:', error);
          stream.close();
          setTimeout(_startStream, 1000);
        })
        .start();
    };

    _startStream();
  } else {
    console.error(`[initStream] "canvasRef" is undefined, streaming aborted.`, canvasRef);
  }
};

/**
 * Finds the shared canvas document.
 *
 * Always use "1" as document ref id.
 * There is only one document in the DB, and the same document is shared with all users.
 */
export const findUserCanvasRef = async (user: UserSession | null): Promise<Expr | undefined> => {
  if (user) {
    return await findOrCreateUserCanvas(user);
  } else {
    return Ref(Collection('Canvas'), SHARED_CANVAS_DOCUMENT_ID);
  }
};

export const findOrCreateUserCanvas = async (user: UserSession): Promise<Expr | undefined> => {
  console.log('findOrCreateUserCanvas');
  const client: Client = getUserClient(user);
  const findUserCanvas = Paginate(
    Match(
      Index('canvas_by_owner'),
      Ref(Collection('Users'), user.id),
    ),
  );

  try {
    const findUserCanvasResult: CanvasByOwnerIndex = await client.query<CanvasByOwnerIndex>(findUserCanvas);
    console.log('findUserCanvasResult', findUserCanvasResult);

    if (findUserCanvasResult?.data?.length === 0) {
      // This user doesn't have a Canvas document yet
      const canvasDataset: CanvasDataset = {
        nodes: [],
        edges: [],
      };
      const canvas: Canvas = {
        data: {
          owner: Ref(Collection('Users'), user.id),
          ...canvasDataset,
        },
      };

      const createUserCanvas = Create(
        Collection('Canvas'),
        canvas,
      );

      try {
        const createUserCanvasResult = await client.query<Canvas>(createUserCanvas);
        console.log('createUserCanvasResult', createUserCanvasResult);

        // Update the current canvas with the new dataset
        // setRecoilExternalState(canvasDatasetSelector, canvasDataset);

        return createUserCanvasResult?.ref;
      } catch (e) {
        console.error(`[findOrCreateUserCanvas] Error while creating canvas:`, e);
      }
    } else {
      // Return existing canvas reference
      // Although users could have several canvas (projects), they can only create one and thus we only care about the first
      const [canvasRef] = findUserCanvasResult.data[0];
      return canvasRef;
    }
  } catch (e) {
    console.error(`[findOrCreateUserCanvas] Error while fetching canvas:`, e);
  }
};

/**
 * Updates the user canvas document.
 *
 * Only update if the content has changed, to avoid infinite loop because this is called during canvas rendering (useEffect)
 *
 * @param user
 * @param newCanvasDataset
 */
export const updateUserCanvas = async (user: UserSession | null, newCanvasDataset: CanvasDataset): Promise<void> => {
  const client: Client = getUserClient(user);

  try {
    const canvasRef = await findUserCanvasRef(user);

    if (canvasRef) {
      const existingCanvasDatasetResult: CanvasResult = await client.query(Get(canvasRef));
      const existingCanvasDataset: CanvasDataset = {
        // Consider only nodes/edges and ignore other fields to avoid false-positive difference that musn't be taken into account
        nodes: existingCanvasDatasetResult.data?.nodes,
        edges: existingCanvasDatasetResult.data?.edges,
      };

      if (!isEqual(existingCanvasDataset, newCanvasDataset)) {
        console.log('Updating canvas dataset in FaunaDB. Old:', existingCanvasDataset, 'new:', newCanvasDataset, 'diff:', diff(existingCanvasDataset, newCanvasDataset));

        try {
          const updateCanvasResult: CanvasResult = await client.query<CanvasResult>(Update(canvasRef, { data: newCanvasDataset }));
          console.log('updateCanvasResult', updateCanvasResult);

          const canvasDataset: CanvasDataset = {
            nodes: updateCanvasResult?.data?.nodes,
            edges: updateCanvasResult?.data?.edges,
          };
          console.log('new canvasDataset (from db)', canvasDataset);

          // Update the current canvas with the existing dataset
          // setRecoilExternalState(canvasDatasetSelector, canvasDataset)

        } catch (e) {
          console.error(`[updateUserCanvas] Error while updating canvas:`, e);
        }
      }
    } else {
      console.error(`[updateUserCanvas] "canvasRef" is undefined, update aborted.`, canvasRef);
    }
  } catch (e) {
    console.error(`[updateUserCanvas] Error while fetching canvas:`, e);
  }
};

export const onInit: OnInit = (canvasDataset: CanvasDataset) => {
  // Starts the stream between the browser and the FaunaDB using the default canvas document
  console.log('onInit canvasDataset', canvasDataset);
  setRecoilExternalState(canvasDatasetSelector, canvasDataset);
};

export const onUpdate: OnUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => {
  setRecoilExternalState(canvasDatasetSelector, canvasDatasetRemotelyUpdated);
};
