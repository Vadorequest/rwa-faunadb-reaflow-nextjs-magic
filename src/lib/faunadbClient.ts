import faunadb, {
  Create,
  Expr,
  Get,
  Update,
} from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import * as Fauna from 'faunadb/src/types/values';
import isEqual from 'lodash.isequal';
import { CanvasDataset } from '../types/CanvasDataset';

const { Ref, Collection } = faunadb.query;
const client = new faunadb.Client({ secret: 'fnAEDdp0CWACBZUTQvkktsqAQeW03uDhZYY0Ttlg' });

type CanvasResult = Fauna.values.Document<CanvasDataset>;
type VersionEvent = {
  action: 'create' | 'update' | 'delete';
  document: CanvasResult;
  diff: CanvasResult;
  prev: CanvasResult;
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
export const startStreamingCanvasDataset = (onInit: (canvasDataset: CanvasDataset) => void, onUpdate: (canvasDataset: CanvasDataset) => void) => {
  let stream: Subscription;

  const _startStream = async (documentRef: Expr) => {
    console.log(`Stream to FaunaDB is starting for:`, documentRef);

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
      .on('version', (version: VersionEvent) => {
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

  _startStream(findSharedCanvasDocument());
};
