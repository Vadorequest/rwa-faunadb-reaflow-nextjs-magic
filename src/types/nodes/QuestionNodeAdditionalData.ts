import BaseNodeAdditionalData from '../BaseNodeAdditionalData';
import { QuestionChoiceType } from './QuestionChoiceType';

export type QuestionChoiceVariable = {
  id: string;
  createdAt: string; // lodash.now
  name?: string;
  value?: string; // TODO handle i18n
}

export type QuestionNodeAdditionalData = BaseNodeAdditionalData & {
  text?: string;
  questionType?: QuestionChoiceType;
  variableName?: string;
  questionChoices?: QuestionChoiceVariable[];
};
