import { QuestionChoiceType } from './nodes/QuestionChoiceType';
import { QuestionChoiceVariable } from './nodes/QuestionNodeAdditionalData';

/**
 * Variable used by a node. The variable's name is used as index to store the user's answer.
 */
export type Variable = {
  name: string;
  label: string;
  type: QuestionChoiceType;
  choices: QuestionChoiceVariable[];
}

export default Variable;
