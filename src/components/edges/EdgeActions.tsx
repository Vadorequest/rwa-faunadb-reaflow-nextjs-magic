import React, { Fragment } from 'react';
import {
  Add,
  AddProps,
  Remove,
  RemoveProps,
} from 'reaflow';
import BaseEdgeData from '../../types/BaseEdgeData';

type Props = {
  hidden: boolean;
  onRemove?: (
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    edge: BaseEdgeData,
  ) => void;
  onAdd?: (
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    edge: BaseEdgeData,
  ) => void;
} & Partial<AddProps | RemoveProps>;

/**
 * Displays the edge's actions (add node, remove current edge).
 *
 * Displays the actions only when the edge is being selected.
 * Displays the actions a bit above the edge, in a line.
 */
const EdgeActions: React.FunctionComponent<Props> = (props) => {
  const {
    x,
    y,
    onAdd,
    onRemove,
  } = props;
  const aboveLineY = (y || 0) - 20;
  const removeX = (x || 0) + 20;

  // console.log('EdgeActions props', props);

  return (
    <Fragment>
      <Add
        {...props}
        y={aboveLineY}
        // @ts-ignore
        onClick={onAdd}
      />
      <Remove
        {...props}
        x={removeX}
        y={aboveLineY}
        // @ts-ignore
        onClick={onRemove}
      />
    </Fragment>
  );
};

export default EdgeActions;
