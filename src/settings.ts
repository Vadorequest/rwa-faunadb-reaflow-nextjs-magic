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
   * Drag & Drop
   */
  dnd: {
    /**
     * Color applied to the "closest" element when dragging a block close to a node.
     */
    colorClosest: '#002aff',

    /**
     * Minimum distance threshold to consider a dragged block to be close to a node.
     */
    closeDistanceThreshold: 10,
  },
};

export default settings;
