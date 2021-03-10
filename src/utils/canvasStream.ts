import {
  Client,
  Create,
  Expr,
  Get,
  Update,
} from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import isEqual from 'lodash.isequal';
import { setRecoilExternalState } from '../components/RecoilExternalStatePortal';
import {
  getClient,
  q,
} from '../lib/faunadb/faunadb';
import { canvasDatasetSelector } from '../states/canvasDatasetSelector';
import { UserSession } from '../types/auth/UserSession';
import { CanvasDataset } from '../types/CanvasDataset';
import { CanvasResult } from '../types/faunadb/CanvasResult';
import {
  OnInit,
  OnUpdate,
} from '../types/faunadb/CanvasStream';
import { FaunadbStreamVersionEvent } from '../types/faunadb/FaunadbStreamVersionEvent';

const { Ref, Collection } = q;

const PUBLIC_SHARED_FAUNABD_TOKEN = 'fnAEDdp0CWACBZUTQvkktsqAQeW03uDhZYY0Ttlg';
const SHARED_CANVAS_DOCUMENT_ID = '1';

export const getUserClient = (user: UserSession | null): Client => {
  const secret = user?.faunaDBToken || PUBLIC_SHARED_FAUNABD_TOKEN;

  return getClient(secret);
};

/**
 * Starts the real-time stream between the browser and the FaunaDB database, on a specific record/document.
 *
 * @param user
 * @param onInit
 * @param onUpdate
 */
export const initStream = (user: UserSession | null, onInit: OnInit, onUpdate: OnUpdate) => {
  const client: Client = getUserClient(user);
  const canvasRef: Expr = findUserCanvasRef(user);
  console.log('Working on Canvas document', canvasRef);
  let stream: Subscription;

  const _startStream = async () => {
    console.log(`Stream to FaunaDB is (re)starting for:`, canvasRef);

    stream = client.stream.
      // @ts-ignore
      document(canvasRef)
      .on('start', (at: number) => {
        console.log('Stream started at:', at);
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
          const createDefaultRecord = Create(Ref(Collection('Canvas'), '1'), {
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
};

/**
 * Finds the shared canvas document.
 *
 * Always use "1" as document ref id.
 * There is only one document in the DB, and the same document is shared with all users.
 */
export const findUserCanvasRef = (user: UserSession | null): Expr => {
  let userDocumentId: string;

  if (user) {
    userDocumentId = ''; // TODO
  } else {
    userDocumentId = SHARED_CANVAS_DOCUMENT_ID;
  }

  return Ref(Collection('Canvas'), userDocumentId);
};

/**
 * Updates the shared canvas document.
 *
 * Only update if the content has changed, to avoid infinite loop because this is called during canvas rendering (useEffect)
 *
 * @param user
 * @param newCanvasDataset
 */
export const updateSharedCanvasDocument = async (user: UserSession | null, newCanvasDataset: CanvasDataset) => {
  const client: Client = getUserClient(user);
  const existingCanvasDatasetResult: CanvasResult = await client.query(Get(findUserCanvasRef(user)));
  const existingCanvasDataset: CanvasDataset = existingCanvasDatasetResult.data;

  if (!isEqual(newCanvasDataset, existingCanvasDataset)) {
    console.log('Updating canvas dataset in FaunaDB. Old:', existingCanvasDataset, 'new:', newCanvasDataset);

    return client
      .query(Update(findUserCanvasRef(user), { data: newCanvasDataset }))
      // @ts-ignore
      .then((result: CanvasResult) => {
        console.log('FaunaDB Canvas dataset updated', result);
      })
      .catch((error: Error) => {
        console.error(error);
      });
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
