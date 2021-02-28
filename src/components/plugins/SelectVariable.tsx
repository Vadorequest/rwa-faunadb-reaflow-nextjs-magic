import React from 'react';
import ReactSelect from 'react-select';
import {
  ActionMeta,
  OptionTypeBase,
  ValueType,
} from 'react-select/src/types';
import { useRecoilState } from 'recoil';
import { variablesSelector } from '../../states/variablesState';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';
import Variable from '../../types/Variable';

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

  const [variables] = useRecoilState(variablesSelector);

  // Converts Variable shapes into ReactSelectDefaultOption shapes
  const variablesAsOptions: ReactSelectDefaultOption[] = variables?.map((variable: Variable) => {
    return {
      value: variable?.name, // The name of the variable becomes the select "value" field
      label: variable?.label,
    };
  });

  return (
    <ReactSelect
      className={'select select-simple'}
      isMulti={false}
      value={variablesAsOptions?.find((variable: ReactSelectDefaultOption) => variable?.value === selectedVariableName)}
      options={variablesAsOptions}
      onChange={onSelectedVariableChange as (value: ValueType<OptionTypeBase, boolean>, actionMeta: ActionMeta<OptionTypeBase>) => void}
    />
  );
};

export default SelectVariable;
