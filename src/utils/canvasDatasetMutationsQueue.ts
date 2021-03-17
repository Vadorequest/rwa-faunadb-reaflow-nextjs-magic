import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import remove from 'lodash.remove';
import { SetterOrUpdater } from 'recoil';
import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';
import { CanvasDataset } from '../types/CanvasDataset';
import { CanvasDatasetMutation } from '../types/CanvasDatasetMutation';

export type ApplyPendingMutationsArgs = {
  nodes: BaseNodeData[];
  edges: BaseEdgeData[];
  mutationsCounter: number;
  setCanvasDataset: SetterOrUpdater<CanvasDataset>;
}
export type ApplyPendingMutations = (
  {
    nodes,
    edges,
    mutationsCounter,
    setCanvasDataset,
  }: ApplyPendingMutationsArgs,
) => void;

/**
 * Global object initialized once per page.
 *
 * Contains the queue of mutations that have been done, or are to be done.
 */
export const mutationsQueue: CanvasDatasetMutation[] = [];

/**
 * Applies all pending mutations.
 *
 * Loops over all mutations, only consider those in "pending" state.
 * Consolidate all mutations as one update by merging (in order) all mutations together.
 * Then, update the canvas dataset (which will refresh the UI).
 *
 * @param nodes
 * @param edges
 * @param mutationsCounter
 * @param setCanvasDataset
 */
export const applyPendingMutations: ApplyPendingMutations = ({ nodes, edges, mutationsCounter, setCanvasDataset }) => {
  // Only consider mutations that are pending
  const mutationsToApply = mutationsQueue.filter((mutation: CanvasDatasetMutation) => mutation.status === 'pending');
  console.log(`mutationsToApply (${mutationsToApply?.length})`, cloneDeep(mutationsToApply), 'queue:', cloneDeep(mutationsQueue));

  if (mutationsToApply?.length > 0) {
    const newNodes: BaseNodeData[] = cloneDeep(nodes);
    const newEdges: BaseEdgeData[] = cloneDeep(edges);

    // Mark all patches as being processed
    mutationsToApply.map((mutation: CanvasDatasetMutation) => {
      const { id } = mutation;
      const patchIndex: number = mutationsQueue.findIndex((mutation: CanvasDatasetMutation) => mutation.id === id);

      if (patchIndex >= 0) {
        mutationsQueue[patchIndex].status = 'processing';
      }
    });
    console.log(`mutationsToApply (processing (${mutationsToApply?.length}))`, cloneDeep(mutationsToApply));

    // Processing all pending patches into one consolidated update
    mutationsToApply.map((mutation: CanvasDatasetMutation) => {
      const {
        elementId,
        elementType,
        operationType,
        changes,
        status,
      } = mutation;

      if (status === 'processing') {
        if (elementType === 'node') {
          if (operationType === 'patch') {
            const nodeToUpdateIndex: number = newNodes.findIndex((node: BaseNodeData) => node.id === elementId);
            const existingNode: BaseNodeData | undefined = newNodes.find((node: BaseNodeData) => node?.id === elementId);
            const patchedNode: BaseNodeData = {} as BaseNodeData;

            if (typeof existingNode !== 'undefined') {
              merge(patchedNode, existingNode, changes);
              console.log(`Applying patch N°${mutationsCounter}:`, changes, 'to node:', existingNode, 'result:', patchedNode);
              newNodes[nodeToUpdateIndex] = patchedNode;
            } else {
              console.log(`Couldn't find node to patch with id "${nodeToUpdateIndex}".`);
            }
          } else if (operationType === 'add') {
            newNodes.push(changes as BaseNodeData);
          } else if (operationType === 'delete') {
            remove(newNodes, (node: BaseNodeData) => node?.id === elementId);
          } else {
            console.error(`Not implemented ${operationType}`);
          }
        } else {
          console.error(`Not implemented ${elementType}`);
        }
      } else {
        console.log('The mutation must not be processed. (status !== "processing")', mutation);
      }
    });

    console.log('Saving new dataset (batch)', {
      nodes: newNodes,
      edges: newEdges,
    });
    setCanvasDataset({
      nodes: newNodes,
      edges: newEdges,
    });

    // Mark all processed patches as having been applied
    mutationsToApply.map((mutation: CanvasDatasetMutation) => {
      const { id } = mutation;
      const patchIndex: number = mutationsQueue.findIndex((mutation: CanvasDatasetMutation) => mutation.id === id);

      if (patchIndex >= 0) {
        mutationsQueue[patchIndex].status = 'applied';
      }
    });

    // Cleanup mutations that have been applied to avoid memory leak for long-running sessions
    setTimeout(() => {
      cleanupAppliedPatches();
    }, 10000);
  }
};

/**
 * Remove all mutations that have been applied.
 */
export const cleanupAppliedPatches = () => {
  const removedMutations = remove<CanvasDatasetMutation>(mutationsQueue, (mutation: CanvasDatasetMutation) => {
    return mutation.status === 'applied';
  });

  console.debug('Mutations have been purged', removedMutations, 'queue:', mutationsQueue);
};
