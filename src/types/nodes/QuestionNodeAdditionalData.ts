import BaseNodeAdditionalData from '../BaseNodeAdditionalData';
import { QuestionChoiceType } from './QuestionChoiceType';

export type QuestionNodeAdditionalData = BaseNodeAdditionalData & {
  text?: string;
  questionType?: QuestionChoiceType;
  variableName?: string;
};
