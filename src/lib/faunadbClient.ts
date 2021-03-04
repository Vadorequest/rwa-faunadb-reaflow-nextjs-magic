import faunadb from 'faunadb';
import { Subscription } from 'faunadb/src/types/Stream';

const client = new faunadb.Client({ secret: 'fnAEDdp0CWACBZUTQvkktsqAQeW03uDhZYY0Ttlg' });

var q = faunadb.query;
var docRef = q.Ref(q.Collection('Scores'), '1');

let stream: Subscription;

const startStream = () => {
  stream = client.stream.
    // @ts-ignore
    document(docRef)
    .on('snapshot', (snapshot: any) => {
      console.log(snapshot);
    })
    .on('version', (version: any) => {
      console.log(version);
    })
    .on('error', (error: any) => {
      console.log('Error:', error);
      stream.close();
      setTimeout(startStream, 1000);
    })
    .start();
};

startStream();
