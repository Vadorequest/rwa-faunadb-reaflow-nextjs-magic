import {
  ActionMeta,
  OptionTypeBase,
} from 'react-select/src/types';
import { ReactSelectDefaultOption } from './ReactSelect';

/**
 * React select "onChange".
 */
export type OnSelectedOptionChange = (selectedOption: ReactSelectDefaultOption, actionMeta: ActionMeta<OptionTypeBase>) => void;
