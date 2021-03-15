import BaseNodeAdditionalData from '../BaseNodeAdditionalData';
import NodeDataWithVariableName from '../NodeDataWithVariableName';
import { QuestionChoiceType } from './QuestionChoiceType';

/**
 * Variable used as a question's choice.
 */
export type QuestionChoiceVariable = {
  /**
   * Id of the variable.
   * Used for react indexing ("key").
   */
  id: string;

  /**
   * Timestamp of creation. (should use lodash.now())
   */
  createdAt: string;

  /**
   * Name of the variable.
   */
  name?: string;

  /**
   * Value of the variable.
   * String is the expected type (because text input), but it could also represent a number.
   *
   * TODO handle i18n
   */
  value?: string;
}

/**
 * Additional "node.data" for the "QuestionNodeData" type.
 */
export type QuestionNodeAdditionalData = BaseNodeAdditionalData & NodeDataWithVariableName & {
  /**
   * Question asked to the user (as text).
   */
  questionText?: string;

  /**
   * Type of the question
   */
  questionChoiceType?: QuestionChoiceType;

  /**
   * Question choices.
   *
   * Used when questionChoiceType is 'single-quick-reply'.
   */
  questionChoices?: QuestionChoiceVariable[];

  /**
   * Dynamic heights.
   *
   * The height of the node is dynamic and depends on the cumulated height of multiple sources.
   * Storing the height of each source allows to resolve what heights should be used by default (during component initialization)
   * for each part of the node component.
   *
   * Also, it allows to adapt existing nodes when the node default properties change.
   * For instance, if the baseHeight is changed in the future because we add a new feature that takes some space,
   * we'll be able to detect that "dynHeights.baseWidth" is different from the node's "baseHeight" and update the node "dynHeights/.baseWidth",
   * so the new feature will be visible immediately.
   */
  dynHeights: BaseNodeAdditionalData['dynHeights'] & {
    questionTextareaHeight?: number;
    choicesBaseHeight?: number;
  }
};
