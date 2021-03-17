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
import {
  Canvas,
  UpdateCanvas,
} from '../types/faunadb/Canvas';
import { CanvasByOwnerIndex } from '../types/faunadb/CanvasByOwnerIndex';
import { CanvasDatasetResult } from '../types/faunadb/CanvasDatasetResult';
import {
  OnStreamedDocumentUpdate,
  OnStreamError,
  OnStreamInit,
  OnStreamStart,
} from '../types/faunadb/CanvasStream';
import { FaunadbStreamVersionEvent } from '../types/faunadb/FaunadbStreamVersionEvent';
import { TypeOfRef } from '../types/faunadb/TypeOfRef';

const PUBLIC_SHARED_FAUNABD_TOKEN = process.env.NEXT_PUBLIC_SHARED_FAUNABD_TOKEN as string;
const SHARED_CANVAS_DOCUMENT_ID = '1';

export const getUserClient = (user: Partial<UserSession>): Client => {
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
 *
 * @param onError
 * @see https://docs.fauna.com/fauna/current/drivers/streaming.html#events
 */
export const initStream = async (user: Partial<UserSession>, onStart: OnStreamStart, onInit: OnStreamInit, onUpdate: OnStreamedDocumentUpdate, onError: OnStreamError) => {
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
        .on('snapshot', (snapshot: CanvasDatasetResult) => {
          console.log('[Streaming] "snapshot" event', snapshot);
          onInit(snapshot.data);
        })
        .on('version', (version: FaunadbStreamVersionEvent) => {
          console.log('[Streaming] "version" event', version);

          if (version.action === 'update') {
            const canvasDatasetFromRemote: CanvasDatasetResult = version.document;

            if (canvasDatasetFromRemote?.data?.lastUpdatedBySessionEphemeralId !== user?.sessionEphemeralId) {
              console.log(`[Streaming] Update event received from different editor "${canvasDatasetFromRemote?.data?.lastUpdatedByUserName}" is being applied.`);
              onUpdate(canvasDatasetFromRemote?.data);
            } else {
              console.log('[Streaming] Update event received from same editor has been ignored.');
            }
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
            const result: CanvasDatasetResult = await client.query(createDefaultRecord);
            console.log('result', result);
            onInit(result?.data);
          } else {
            stream.close();
            onError(error, _startStream);
          }
        })
        // Not tested
        .on('history_rewrite', (error: any) => {
          console.log('Error:', error);
          stream.close();
          onError(error, _startStream);
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
export const findUserCanvasRef = async (user: Partial<UserSession>): Promise<Expr | undefined> => {
  if (user?.isAuthenticated) {
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
export const findOrCreateUserCanvas = async (user: Partial<UserSession>): Promise<Expr | undefined> => {
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
          ...canvasDataset,
          owner: Ref(Collection('Users'), user.id),

          // Indicating who's the editor who's made the change, so we can safely ignore the "version:update" event we'll soon receive
          // when the DB will notify all subscribed editors about the update
          lastUpdatedBySessionEphemeralId: user.sessionEphemeralId as string,
          lastUpdatedByUserName: user?.email || `Anonymous#${user?.id?.substring(0, 8)}`,
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
 * Checks whether the canvas dataset should be updated in the database, by comparing the previous and new dataset.
 *
 * Ignores dataset changes if the dataset contains only:
 *  - a start node with no edge
 *  - OR a start node and an end node and one edge
 *  - OR no node and no edge (it's temporary state until default nodes/edges are created)
 *
 * @param newCanvasDataset
 */
export const hasDatasetChanged = (newCanvasDataset: CanvasDataset): boolean => {
  const isEmptyDataset: boolean = newCanvasDataset?.nodes?.length === 0 && newCanvasDataset?.edges?.length === 0;
  if (isEmptyDataset) {
    return false;
  }

  const isDefaultDataset: boolean = newCanvasDataset?.nodes?.length === 1 && newCanvasDataset?.edges?.length === 0 && newCanvasDataset?.nodes[0]?.data?.type === 'start'
    || newCanvasDataset?.nodes?.length === 2 && newCanvasDataset?.edges?.length === 1 && newCanvasDataset?.nodes[0]?.data?.type === 'start' && newCanvasDataset?.nodes[1]?.data?.type === 'end';
  return !isDefaultDataset;
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
 * @param previousCanvasDataset
 */
export const updateUserCanvas = async (canvasRef: TypeOfRef | undefined, user: Partial<UserSession>, newCanvasDataset: CanvasDataset, previousCanvasDataset: CanvasDataset | undefined): Promise<void> => {
  const client: Client = getUserClient(user);

  try {
    if (canvasRef) {
      console.info(`[updateUserCanvas] Update request triggered, checking if it should be done.`);

      // Checking if the local dataset has really changed
      if (hasDatasetChanged(newCanvasDataset)) {
        // Checking if the previous and new datasets (local) have changed helps avoiding unnecessary database updates
        const areLocalDatasetsDifferent = !isEqual(previousCanvasDataset, newCanvasDataset); // isEqual performs a deep comparison
        const localDiff = diff(previousCanvasDataset, newCanvasDataset);

        if (areLocalDatasetsDifferent) {
          // Even when the local dataset has changed, it might just be due to synchronizing from a remote change
          // In such case (which is frequent when there are several people working on the same doc),
          // checking the local vs remote dataset helps avoiding unnecessary updates, which in turn doesn't update all client
          // XXX This is very important in a real-time context, because if the remote DB is updated needlessly,
          //  it'll in turn trigger a "version" event which will be received by ALL subscribed clients,
          //  which in turn will update their own local dataset, which might not be up-to-date, which will trigger yet another update
          //  It can get messy real quick and trigger infinite loops if not handled very carefully.
          const existingRemoteCanvasDatasetResult: CanvasDatasetResult = await client.query(Get(canvasRef));
          const existingRemoteCanvasDataset: CanvasDataset = {
            // Consider only nodes/edges and ignore other fields to avoid false-positive difference that mustn't be taken into account
            nodes: existingRemoteCanvasDatasetResult.data?.nodes,
            edges: existingRemoteCanvasDatasetResult.data?.edges,
          };
          const isRemoteDatasetsDifferent = !isEqual(existingRemoteCanvasDataset, newCanvasDataset); // isEqual performs a deep comparison
          const remoteDiff = diff(previousCanvasDataset, newCanvasDataset);

          if (isRemoteDatasetsDifferent) {
            console.debug('[updateUserCanvas] Updating canvas dataset in FaunaDB. Old:', previousCanvasDataset, 'new:', newCanvasDataset, 'diff:', remoteDiff);

            try {
              const newCanvas: UpdateCanvas = {
                data: {
                  ...newCanvasDataset,

                  // Indicating who's the editor who's made the change, so we can safely ignore the "version:update" event we'll soon receive
                  // when the DB will notify all subscribed editors about the update
                  lastUpdatedBySessionEphemeralId: user.sessionEphemeralId as string,
                  lastUpdatedByUserName: user?.email || `Anonymous#${user?.id?.substring(0, 8)}`,
                },
              };
              const updateCanvasDatasetResult: CanvasDatasetResult = await client.query<CanvasDatasetResult>(Update(canvasRef, newCanvas));
              console.log('[updateUserCanvas] updateCanvasResult', updateCanvasDatasetResult);
            } catch (e) {
              console.error(`[updateUserCanvas] Error while updating canvas:`, e);

              // Handling concurrent updates errors by using the value from the remote
              // This makes sure we are up-to-date with the remote to avoid overwriting work done by other
              if (e?.message === 'contended transaction') {
                console.log('[updateUserCanvas] Concurrent update error detected, overwriting local state with remote state. Local:', newCanvasDataset, 'remote:', existingRemoteCanvasDataset);
                setRecoilExternalState(canvasDatasetSelector, existingRemoteCanvasDataset);
              }
            }
          } else {
            console.log(`[updateUserCanvas] Canvas remote dataset has not changed. Database update was aborted.`, 'diff:', remoteDiff);
          }
        } else {
          console.log(`[updateUserCanvas] Canvas local dataset has not changed. Database update was aborted.`, 'diff:', localDiff);
        }
      } else {
        console.log(`[updateUserCanvas] Canvas dataset has changed, although it's a default/empty dataset. Only non-default and non-empty changes are persisted to the DB (optimization). Database update was aborted.`);
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
export const onInit: OnStreamInit = (canvasDataset: CanvasDataset) => {
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
 * TODO Handle conflicts between changes from 3rd party (another editor) and current working document to avoid erasing the local document and losing changes
 *  For another time, won't be part of the POC.
 *
 * @param canvasDatasetRemotelyUpdated
 *
 * @see https://fauna.com/blog/live-ui-updates-with-faunas-real-time-document-streaming#defining-the-stream
 * @see https://docs.fauna.com/fauna/current/drivers/javascript.html
 */
export const onUpdate: OnStreamedDocumentUpdate = (canvasDatasetRemotelyUpdated: CanvasDataset) => {
  setRecoilExternalState(canvasDatasetSelector, canvasDatasetRemotelyUpdated);
};
