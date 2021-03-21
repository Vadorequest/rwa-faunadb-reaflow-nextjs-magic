import React, { RefObject } from 'react';

/**
 * Contains utilities exposed by the Canvas ref.
 *
 * Contains utilities from both LayoutResult and ZoomResult. (built-in in Reaflow)
 */
export type CanvasUtilsContext = {

  /**
   * Ref to container div.
   */
  containerRef?: RefObject<HTMLDivElement | null>;

  /**
   * Center the canvas to the viewport.
   */
  centerCanvas?: () => void;

  /**
   * Fit the canvas to the viewport.
   */
  fitCanvas?: () => void;

  /**
   * Set a zoom factor of the canvas.
   */
  setZoom?: (factor: number) => void;

  /**
   * Zoom in on the canvas.
   */
  zoomIn?: () => void;

  /**
   * Zoom out on the canvas.
   */
  zoomOut?: () => void;
}

/**
 * Uses native React Context API, meant to be used from hooks only, not by functional components
 *
 * @example Usage
 *  import canvasUtilsContext from './src/stores/canvasUtilsContext';
 *  const { containerRef }: CanvasContext = React.useContext(canvasUtilsContext);
 *
 * @see https://reactjs.org/docs/context.html
 * @see https://medium.com/better-programming/react-hooks-usecontext-30eb560999f for useContext hook example (open in anonymous browser #paywall)
 */
export const canvasUtilsContext = React.createContext<CanvasUtilsContext>({});

export default canvasUtilsContext;
