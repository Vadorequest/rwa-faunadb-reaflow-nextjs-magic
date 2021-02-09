import { CanvasDirection } from 'reaflow/dist/layout';

/**
 * Global settings for the app.
 *
 * Could also be stored as a React Context, but hardcoded settings are kinda similar.
 * @readonly
 */
export const settings = {
  layout: {
    nav: {
      height: 50,
    },
    footer: {
      height: 50,
    }
  },

  /**
   * Left container of blocks.
   */
  blocksContainer: {
    width: '150px',
  },

  containerSeparator: {
    width: '20px',
  },

  /**
   * SVG Canvas where nodes and edges are drawn.
   */
  canvas: {
    direction: 'RIGHT' as CanvasDirection,
    ports: {
      radius: 15,
    },
  },
};

export default settings;
