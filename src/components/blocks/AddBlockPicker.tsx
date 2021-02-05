import React from 'react';
import { Add } from 'reaflow';
import { AddProps } from 'reaflow/dist/symbols/Add/Add';

type Props = {} & Partial<AddProps>;

const AddBlockPicker: React.FunctionComponent<Props> = (props) => {
  const { hidden = false, ...rest } = props;

  return (
    <Add
      {...rest}
      hidden={false}
    />
  );
};

export default AddBlockPicker;
