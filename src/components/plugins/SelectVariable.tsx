import React, { useState } from 'react';
import ReactSelect from 'react-select';
import {
  ActionMeta,
  OptionTypeBase,
  ValueType,
} from 'react-select/src/types';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';

export type OnSelectedVariableChange = (selectedOption: ReactSelectDefaultOption, actionMeta: ActionMeta<OptionTypeBase>) => void;

type Props = {
  selectedVariableName: string | undefined;
  onSelectedVariableChange: OnSelectedVariableChange;
};

/**
 * Select that displays a list of all variables currently used in the application.
 */
export const SelectVariable: React.FunctionComponent<Props> = (props) => {
  const {
    selectedVariableName,
    onSelectedVariableChange,
  } = props;

  // TODO get variables from shared state (from nodes)
  const [variables] = useState<ReactSelectDefaultOption[]>([
    {
      label: 'test',
      value: 'test',
    },
  ]);

  return (
    <ReactSelect
      className={'select select-simple'}
      isMulti={false}
      value={variables.find((variable: ReactSelectDefaultOption) => variable?.value === selectedVariableName)}
      options={variables}
      onChange={onSelectedVariableChange as (value: ValueType<OptionTypeBase, boolean>, actionMeta: ActionMeta<OptionTypeBase>) => void}
    />
  );
};

export default SelectVariable;
