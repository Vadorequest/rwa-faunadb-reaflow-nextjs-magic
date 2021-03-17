import BaseEdgeData from './BaseEdgeData';
import PartialBaseNodeData from './PartialBaseNodeData';

export type NewCanvasDatasetMutation = Omit<CanvasDatasetMutation, 'status' | 'id'>
export type AddCanvasDatasetMutation = (mutation: NewCanvasDatasetMutation) => void;

export type CanvasDatasetMutation = {
  /**
   * ID of the mutation, must be unique.
   *
   * UUID (v1).
   */
  id: string;

  /**
   * Status of the mutation.
   *
   * - applied: Has been applied.
   * - processing: Is being processed.
   * - waiting: Has not been processed yet, awaiting for the next batch of mutations.
   */
  status: 'applied' | 'processing' | 'waiting';

  /**
   * The ID of the node/edge to mutate.
   */
  elementId: string;

  /**
   * The type of the element to mutate.
   */
  elementType: 'node' | 'edge';

  /**
   * Operation to perform on the element.
   *
   * - add: Add a new element.
   * - patch: Update an existing element. Only updates the specified properties of the element, leaving other properties untouched.
   * - delete: Delete and existing element.
   */
  operationType: 'add' | 'patch' | 'delete';

  /**
   * Patch to apply to the element.
   *
   * Only set for "patch" operation.
   */
  patch?: PartialBaseNodeData | Partial<BaseEdgeData>
}
