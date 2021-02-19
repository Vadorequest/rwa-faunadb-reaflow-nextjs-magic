import React from 'react';
import { Add } from 'reaflow';
import { AddProps } from 'reaflow/dist/symbols/Add/Add';

type Props = {} & Partial<AddProps>;

const AddBlockPicker: React.FunctionComponent<Props> = (props) => {
  const { ...rest } = props;

  return (
    <Add
      {...rest}
    />
  );
};

export default AddBlockPicker;
