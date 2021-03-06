import React from 'react';
import ReactSelect, { CommonProps } from 'react-select';
import { useRecoilState } from 'recoil';
import { variablesSelector } from '../../states/variablesState';
import { OnSelectedOptionChange } from '../../types/OnSelectedOptionChange';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';
import Variable from '../../types/Variable';

type Props = {
  selectedVariableName: string | undefined;
  onSelectedVariableChange: OnSelectedOptionChange;
} & Partial<CommonProps<ReactSelectDefaultOption, false>> & React.HTMLProps<HTMLSelectElement>;

/**
 * Select displaying a list of all variables currently used.
 *
 * The list of variables is automatically resolved by lookup on all existing nodes.
 * This is done automatically by the "variablesSelector".
 */
export const SelectVariable: React.FunctionComponent<Props> = (props) => {
  const {
    selectedVariableName,
    onSelectedVariableChange,
    ...rest
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
      // @ts-ignore
      value={variablesAsOptions?.find((option: ReactSelectDefaultOption) => option?.value === selectedVariableName)}
      options={variablesAsOptions}
      onChange={onSelectedVariableChange as any}
      {...rest}
    />
  );
};

export default SelectVariable;
