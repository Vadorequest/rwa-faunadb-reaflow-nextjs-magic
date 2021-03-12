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
import { TypeOfRef } from '../types/faunadb/TypeOfRef';

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
          console.log('[Streaming] Started at', at);
          onStart(stream, canvasRef as TypeOfRef, at);
        })
        .on('snapshot', (snapshot: CanvasResult) => {
          console.log('[Streaming] "snapshot" event', snapshot);
          onInit(snapshot.data);
        })
        .on('version', (version: FaunadbStreamVersionEvent) => {
          console.log('[Streaming] "version" event', version);

          if (version.action === 'update') {
            onUpdate(version.document.data);
          }
        })
        .on('error', async (error: any) => {
          console.error('[Streaming] "error" event:', error);

          // XXX Not sure if this is still valid, it was useful at first (when not automatically creating the document if not found) but might not be needed anymore
          //  Might still be useful when creating the shared document, which doesn't belong to a user in particular?
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

/**
 * Finds the canvas of the given user, creates it if doesn't exist.
 *
 * @param user
 */
export const findOrCreateUserCanvas = async (user: UserSession): Promise<Expr | undefined> => {
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
 * Only update if the content has changed, to avoid infinite loop because this function is called when the CanvasContainer component renders (useEffect).
 *
 * If the user doesn't have the permissions to update the canvasRef, it'll fail.
 * The "Editor" role only allows the owner to edit its own documents.
 *
 * @param canvasRef Working canvas document reference that'll be modified
 * @param user
 * @param newCanvasDataset
 */
export const updateUserCanvas = async (canvasRef: TypeOfRef | undefined, user: UserSession | null, newCanvasDataset: CanvasDataset): Promise<void> => {
  const client: Client = getUserClient(user);

  try {
    if (canvasRef) {
      const existingCanvasDatasetResult: CanvasResult = await client.query(Get(canvasRef));
      const existingCanvasDataset: CanvasDataset = {
        // Consider only nodes/edges and ignore other fields to avoid false-positive difference that mustn't be taken into account
        nodes: existingCanvasDatasetResult.data?.nodes,
        edges: existingCanvasDatasetResult.data?.edges,
      };

      // isEqual performs a deep comparison
      if (!isEqual(existingCanvasDataset, newCanvasDataset)) {
        console.log('Updating canvas dataset in FaunaDB. Old:', existingCanvasDataset, 'new:', newCanvasDataset, 'diff:', diff(existingCanvasDataset, newCanvasDataset));

        try {
          const updateCanvasResult: CanvasResult = await client.query<CanvasResult>(Update(canvasRef, { data: newCanvasDataset }));
          console.log('updateCanvasResult', updateCanvasResult);
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

/**
 * Invoked when the streaming has been initialized, update the canvasDataset stored in Recoil.
 *
 * Due to this, we don't need to prefetch the dataset, as it is provided by the stream during initialization.
 * Will be called every time the stream is restarted.
 *
 * > The initial document when you start the stream.
 * > This event provides you with the current state of the document and will arrive after the start event and before other events.
 *
 * @param canvasDataset
 *
 * @see https://fauna.com/blog/live-ui-updates-with-faunas-real-time-document-streaming#defining-the-stream
 * @see https://docs.fauna.com/fauna/current/drivers/javascript.html
 */
export const onInit: OnInit = (canvasDataset: CanvasDataset) => {
  // Starts the stream between the browser and the FaunaDB using the default canvas document
  console.log('onInit canvasDataset', canvasDataset);
  setRecoilExternalState(canvasDatasetSelector, canvasDataset);
};

/**
 * Invoked when an update happens on the streamed document.
 *
 * We only care about the "update" event in this POC. Because "delete"/"create" events cannot happen.
 *
 * > When the data of the document changes, a new event will arrive that details the changes to the document.
 *
 * @param canvasDatasetRemotelyUpdated
 *
 * @see https://fauna.com/blog/live-ui-updates-with-faunas-real-time-document-streaming#defining-the-stream
 * @see https://docs.fauna.com/fauna/current/drivers/javascript.html
 */
export const onUpdate: OnUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => {
  setRecoilExternalState(canvasDatasetSelector, canvasDatasetRemotelyUpdated);
};
