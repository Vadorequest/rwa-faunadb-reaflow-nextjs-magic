import settings from '../settings';

export type PositionMargin = {
  top?: number;
  left?: number;
}

/**
 * Translates a x/y position to another x/y canvas position.
 *
 * Optionally allows to apply a margin.
 *
 * @param x
 * @param y
 * @param margin
 */
export const translateXYToCanvasPosition = (x: number, y: number, margin?: PositionMargin): [x: number, y: number] => {
  const xDelta = 0; // No delta, because the canvas takes the full page width
  const yDelta = settings.layout.nav.height; // Some delta, because the canvas is not at the top of the page, but below the header

  return [
    x - xDelta + (margin?.left || 0),
    y - yDelta + (margin?.top || 0),
  ];
};
