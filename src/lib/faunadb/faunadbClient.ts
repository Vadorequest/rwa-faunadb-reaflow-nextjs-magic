import { isBrowser } from '@unly/utils';
import faunadb, {
  Client,
  Create,
  Expr,
  Get,
  Update,
} from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import isEqual from 'lodash.isequal';
import { CanvasDataset } from '../../types/CanvasDataset';
import { CanvasResult } from '../../types/faunadb/CanvasResult';
import {
  OnInit,
  OnUpdate,
} from '../../types/faunadb/CanvasStream';
import { FaunadbStreamVersionEvent } from '../../types/faunadb/FaunadbStreamVersionEvent';

const { Ref, Collection } = faunadb.query;
let client: Client;

// TODO use stream manager
//  Convert to react component because we need to use hooks
if (isBrowser()) {
  const secret =
    // @ts-ignore
    window['__FAUNADB_USER_TOKEN__']
    || 'fnAEDdp0CWACBZUTQvkktsqAQeW03uDhZYY0Ttlg';

  console.log('Initializing stream client with secret', secret);
  client = new faunadb.Client({
    secret,
  });
}

/**
 * Finds the shared canvas document.
 *
 * Always use "1" as document ref id.
 * There is only one document in the DB, and the same document is shared with all users.
 */
export const findSharedCanvasDocument = (id: string = '1') => {
  return Ref(Collection('Canvas'), id);
};

/**
 * Updates the shared canvas document.
 *
 * Only update if the content has changed, to avoid infinite loop because this is called during canvas rendering (useEffect)
 *
 * @param newCanvasDataset
 */
export const updateSharedCanvasDocument = async (newCanvasDataset: CanvasDataset) => {
  const existingCanvasDatasetResult: CanvasResult = await client.query(Get(findSharedCanvasDocument()));
  const existingCanvasDataset: CanvasDataset = existingCanvasDatasetResult.data;

  if (!isEqual(newCanvasDataset, existingCanvasDataset)) {
    console.log('Updating canvas dataset in FaunaDB. Old:', existingCanvasDataset, 'new:', newCanvasDataset);

    return client
      .query(Update(findSharedCanvasDocument(), { data: newCanvasDataset }))
      // @ts-ignore
      .then((result: CanvasResult) => {
        console.log('FaunaDB Canvas dataset updated', result);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }
};

/**
 * Starts the real-time stream between the browser and the FaunaDB database, on a specific record/document.
 *
 * @param onInit
 * @param onUpdate
 */
export const startStreamingCanvasDataset = (onInit: OnInit, onUpdate: OnUpdate) => {
  let stream: Subscription;

  const _startStream = async () => {
    console.log(`Stream to FaunaDB is starting for:`, findSharedCanvasDocument());

    stream = client.stream.
      // @ts-ignore
      document(documentRef)
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
