import React from 'react';
import ReactSelect, { CommonProps } from 'react-select';
import {
  ActionMeta,
  OptionTypeBase,
} from 'react-select/src/types';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';

export type OnSelectedVariableChange = (selectedOption: ReactSelectDefaultOption, actionMeta: ActionMeta<OptionTypeBase>) => void;

type Props = {
  selectedComparisonOperatorName: string | undefined;
  onSelectedComparisonOperatorChange: OnSelectedVariableChange;
} & Partial<CommonProps<ReactSelectDefaultOption, false>> & React.HTMLProps<HTMLSelectElement>;

type ComparisonOperator = {
  name: string,
  label: string;
}
/**
 * Select that displays a list of all comparison operators available.
 *
 * Those are hardcoded and cannot be added manually.
 */
export const SelectComparisonOperator: React.FunctionComponent<Props> = (props) => {
  const {
    selectedComparisonOperatorName,
    onSelectedComparisonOperatorChange,
    ...rest
  } = props;

  const comparisonOperators: ComparisonOperator[] = [
    {
      name: 'is',
      label: 'Is',
    },
    {
      name: 'is-not',
      label: 'Is not',
    },
  ];

  // Converts comparison operator shapes into ReactSelectDefaultOption shapes
  const comparisonOperatorsAsOptions: ReactSelectDefaultOption[] = comparisonOperators?.map((comparisonOperator: ComparisonOperator) => {
    return {
      value: comparisonOperator?.name, // The name of the comparison operator becomes the select "value" field
      label: comparisonOperator?.label,
    };
  });

  return (
    <ReactSelect
      className={'select select-simple'}
      isMulti={false}
      // @ts-ignore
      value={comparisonOperatorsAsOptions?.find((comparisonOperators: ReactSelectDefaultOption) => comparisonOperators?.value === selectedComparisonOperatorName)}
      options={comparisonOperatorsAsOptions}
      onChange={onSelectedComparisonOperatorChange as any}
      {...rest}
    />
  );
};

export default SelectComparisonOperator;
