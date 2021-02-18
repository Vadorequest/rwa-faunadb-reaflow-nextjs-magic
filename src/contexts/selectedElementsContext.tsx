import React from 'react';
import BaseNodeData from '../types/BaseNodeData';

export type SelectedElementsContext = {
  /**
   * Clear selections method.
   */
  clearSelections: (value?: string[]) => void;
  /**
   * A selection method.
   */
  addSelection: (value: string) => void;
  /**
   * Remove selection method.
   */
  removeSelection: (value: string) => void;
  /**
   * Toggle existing selection on/off method.
   */
  toggleSelection: (value: string) => void;
  /**
   * Set internal selections.
   */
  setSelections: (value: string[]) => void;
  /**
   * On click event pass through.
   */
  onSelectionClick: (event: React.MouseEvent<SVGGElement, MouseEvent>, data: BaseNodeData) => void;
  /**
   * On canvas click event pass through.
   */
  onSelectionCanvasClick: (event?: React.MouseEvent<SVGGElement, MouseEvent>) => void;
  /**
   * On keydown event pass through.
   */
  onSelectionKeyDown: (event: React.KeyboardEvent<SVGGElement>) => void;
};

/**
 * Uses native React Context API
 *
 * @example Usage
 *  import selectedElementsContext from './src/stores/selectedElementsContext';
 *  const { setSelections }: SelectedElementsContext = React.useContext(selectedElementsContext);
 *
 * @see https://reactjs.org/docs/context.html
 * @see https://medium.com/better-programming/react-hooks-usecontext-30eb560999f for useContext hook example (open in anonymous browser #paywall)
 */
export const selectedElementsContext = React.createContext<Partial<SelectedElementsContext>>({});

export default selectedElementsContext;
