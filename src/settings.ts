import { CanvasDirection } from 'reaflow/dist/layout';

/**
 * Global settings for the app.
 *
 * Could also be stored as a React Context, but hardcoded settings are kinda similar.
 * @readonly
 */
export const settings = {
  /**
   * Common layout shared by all Next.js pages.
   */
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

  /**
   * SVG Canvas where nodes and edges are drawn.
   */
  canvas: {
    /**
     * Direction used by the canvas, used by ELKjs.
     */
    direction: 'RIGHT' as CanvasDirection,

    /**
     * Edge's ports.
     */
    ports: {
      radius: 15,
    },
  },
};

export default settings;
