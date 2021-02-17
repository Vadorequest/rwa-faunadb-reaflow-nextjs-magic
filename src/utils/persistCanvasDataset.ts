import { CanvasDataset } from '../types/CanvasDataset';

const LS_NS = 'reaflow-graph';

/**
 * Gets the canvas dataset from the localstorage.
 */
export const getCanvasDatasetFromLS = (): Partial<CanvasDataset> => {
  const data = localStorage.getItem(LS_NS);

  if (!data) {
    return {};
  } else {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};

/**
 * Persists the canvas dataset in the localstorage.
 *
 * @param canvasDataset
 */
export const persistCanvasDatasetInLS = (canvasDataset: CanvasDataset): void => {
  console.log('persistCanvasDatasetInLS', canvasDataset);
  localStorage.setItem(LS_NS, JSON.stringify(canvasDataset));
};
