import React from 'react';
import ReactSelect, { CommonProps } from 'react-select';
import { useRecoilState } from 'recoil';
import { variablesSelector } from '../../states/variablesState';
import { QuestionChoiceVariable } from '../../types/nodes/QuestionNodeAdditionalData';
import { OnSelectedOptionChange } from '../../types/OnSelectedOptionChange';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';
import Variable from '../../types/Variable';

type Props = {
  selectedComparedVariableName: string | undefined;
  selectedExpectedValue: string | undefined;
  onSelectedComparisonChange: OnSelectedOptionChange;
} & Partial<CommonProps<ReactSelectDefaultOption, false>> & React.HTMLProps<HTMLSelectElement>;

/**
 * Select that displays a list of all possible choices for the currently selected variable.
 */
export const SelectExpectedValue: React.FunctionComponent<Props> = (props) => {
  const {
    selectedComparedVariableName,
    selectedExpectedValue,
    onSelectedComparisonChange,
    ...rest
  } = props;

  const [variables] = useRecoilState(variablesSelector);
  const selectedVariable: Variable | undefined = variables?.find((variable: Variable) => variable?.name === selectedComparedVariableName);

  // Converts Variable shapes into ReactSelectDefaultOption shapes
  const selectedVariableChoicesAsOptions: ReactSelectDefaultOption[] = (selectedVariable?.choices?.map((choice: QuestionChoiceVariable) => {
    return {
      value: choice?.name, // The name of the variable becomes the select "value" field
      label: choice?.value,
    };
  }) || []) as ReactSelectDefaultOption[];

  return (
    <ReactSelect
      className={'select select-simple'}
      isMulti={false}
      // @ts-ignore
      value={selectedVariableChoicesAsOptions?.find((option: ReactSelectDefaultOption) => option?.value === selectedExpectedValue)}
      options={selectedVariableChoicesAsOptions}
      onChange={onSelectedComparisonChange as any}
      {...rest}
    />
  );
};

export default SelectExpectedValue;
