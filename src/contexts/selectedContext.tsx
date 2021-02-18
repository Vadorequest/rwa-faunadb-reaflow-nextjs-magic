import React from 'react';
import BaseNodeData from '../types/BaseNodeData';

export type SelectedContext = {
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
 *  import selectedContext from './src/stores/selectedContext';
 *  const { setSelections }: SelectedContext = React.useContext(selectedContext);
 *
 * @see https://reactjs.org/docs/context.html
 * @see https://medium.com/better-programming/react-hooks-usecontext-30eb560999f for useContext hook example (open in anonymous browser #paywall)
 */
export const selectedContext = React.createContext<Partial<SelectedContext>>({});

export default selectedContext;
