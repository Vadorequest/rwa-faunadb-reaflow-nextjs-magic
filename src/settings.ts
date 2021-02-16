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
    nodes: {
      defaultDebounceFor: 250,
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
   * Configuration relative to the nodes.
   */
  nodes: {
    /**
     * Default debounce to use when performing heavy-computing operations.
     *
     * Used for input "onChange" events, etc.
     */
    defaultDebounceFor: number;

    /**
     * Configuration of the "Question" node.
     */
    questionNode: {
      choiceTypeOptions: QuestionChoiceTypeOption[];
    };
  },

  /**
   * Edge's ports.
   */
  ports: {
    radius: number;
  }
}

export default settings;
