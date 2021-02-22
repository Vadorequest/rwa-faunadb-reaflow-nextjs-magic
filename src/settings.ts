import { CanvasDirection } from 'reaflow';
import { QuestionChoiceTypeOption } from './types/nodes/QuestionChoiceTypeOption';

/**
 * @readonly
 */
export const settings: Settings = {
  layout: {
    nav: {
      height: 50,
    },
    footer: {
      height: 50,
    },
  },
  blocksContainer: {
    width: '150px',
  },
  canvas: {
    direction: 'RIGHT',
    maxWidth: 10000, // 10k should handle about 50 horizontal nodes
    maxHeight: 2000,
    nodes: {
      defaultDebounceFor: 250,
      selected: {
        borderColor: 'blue',
      },
      questionNode: {
        choiceTypeOptions: [
          {
            value: `text`,
            label: `Text`,
          },
          {
            value: `single-quick-reply`,
            label: `Single quick reply`,
          },
        ],
      },
    },
    edges: {
      strokeColor: '#b1b1b7',
      selected: {
        strokeColor: 'blue',
      },
    },
    ports: {
      radius: 15,
    },
  },
};

// Make sure nothing can mutate the settings, as it shouldn't happen.
Object.freeze(settings);

/**
 * Global settings for the app.
 *
 * Could also be stored as a React Context, but hardcoded settings are kinda similar.
 */
export type Settings = {
  /**
   * Common layout shared by all Next.js pages.
   */
  layout: LayoutSettings;

  /**
   * Left container of blocks.
   */
  blocksContainer: BlocksContainerSettings;

  /**
   * SVG Canvas where nodes and edges are drawn.
   */
  canvas: CanvasSettings;
}

export type LayoutSettings = {
  nav: {
    height: number;
  },
  footer: {
    height: number;
  }
}

export type BlocksContainerSettings = {
  width: string;
}

export type CanvasSettings = {
  /**
   * Direction used by the canvas, used by ELKjs.
   */
  direction: CanvasDirection;

  /**
   * Maximal width of the canvas.
   *
   * XXX Awaiting https://github.com/reaviz/reaflow/discussions/51 for auto-grow
   */
  maxWidth: number;

  /**
   * Maximal height of the canvas.
   *
   * XXX Awaiting https://github.com/reaviz/reaflow/discussions/51 for auto-grow
   */
  maxHeight: number;

  /**
   * Configuration relative to the nodes.
   */
  nodes: {
    /**
     * Default debounce to use when performing heavy-computing operations.
     *
     * Used for input "onChange" events, etc.
     */
    defaultDebounceFor: number;

    selected: {
      /**
       * Border color when the node is selected.
       */
      borderColor: string;
    }

    /**
     * Configuration of the "Question" node.
     */
    questionNode: {
      choiceTypeOptions: QuestionChoiceTypeOption[];
    };
  },

  /**
   * Configuration relative to the edges.
   */
  edges: {
    /**
     * Color of the edge. (stroke, because it's an SVG element)
     */
    strokeColor: string;

    selected: {
      /**
       * Color when the edge is selected.
       */
      strokeColor: string;
    }
  }

  /**
   * Edge's ports.
   */
  ports: {
    radius: number;
  }
}

export default settings;
