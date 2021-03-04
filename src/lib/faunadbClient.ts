import faunadb, {
  Create,
  Expr,
} from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';
import * as Fauna from 'faunadb/src/types/values';
import { CanvasDataset } from '../types/CanvasDataset';

const { Ref, Collection } = faunadb.query;
const client = new faunadb.Client({ secret: 'fnAEDdp0CWACBZUTQvkktsqAQeW03uDhZYY0Ttlg' });

type CanvasResult = Fauna.values.Document<CanvasDataset>;

/**
 * Find the shared canvas document.
 *
 * Always use "1" as document ref id.
 * There is only one document in the DB, and the same document is shared with all users.
 */
export const findSharedCanvasDocument = (id: string = '1') => {
  return Ref(Collection('Canvas'), id);
};

/**
 * Starts the real-time stream between the browser and the FaunaDB database, on a specific record/document.
 *
 * @param documentRef
 * @param onInit
 */
export const startStreamOnDocument = (documentRef: Expr, onInit: (snapshot: any) => void) => {
  let stream: Subscription;

  const _startStream = async (documentRef: Expr) => {
    console.log(`Stream to FaunaDB is starting for:`, documentRef);

    stream = client.stream.
      // @ts-ignore
      document(documentRef)
      .on('start', (snapshot: any) => {
        console.log('start', snapshot);
      })
      .on('snapshot', (snapshot: any) => {
        console.log('snapshot', snapshot);
        onInit(snapshot);
      })
      .on('version', (version: any) => {
        console.log('version', version);
        onInit(version);
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

  _startStream(documentRef);
};
