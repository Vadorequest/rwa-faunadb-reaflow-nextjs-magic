import BaseNodeData from '../types/BaseNodeData';
import { QuestionNodeData } from '../types/nodes/QuestionNodeData';

/**
 * Applies a TypeScript guard check to make sure the nodeData is of QuestionNodeData type.
 *
 * @param nodeData
 *
 * @see https://rangle.io/blog/how-to-use-typescript-type-guards/
 */
export const isQuestionNodeData = (nodeData: BaseNodeData): nodeData is QuestionNodeData => {
  return nodeData?.data?.type === 'question';
};

