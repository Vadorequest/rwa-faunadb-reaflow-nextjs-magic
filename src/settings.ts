/**
 * Global settings for the app.
 *
 * Could also be stored as a React Context, but hardcoded settings are kinda similar.
 * @readonly
 */
export const settings = {
  /**
   * Left container of blocks.
   */
  blocksContainer: {
    width: '150px',
  },

  containerSeparator:{
    width: '20px'
  },

  /**
   * SVG Canvas where nodes and edges are drawn.
   */
  canvas: {
    ports: {
      radius: 15,
    }
  }
};

export default settings;
