import React from 'react';
import canvasUtilsContext, { CanvasUtilsContext } from '../context/canvasUtilsContext';

export type CanvasUtils = CanvasUtilsContext;

/**
 * Hook to access Reaflow Canvas utilities.
 *
 * Those utilities are provided by Reaflow itself, and made available to all children components within.
 * Uses canvasUtilsContext internally (provides an identical API).
 *
 * This hook should be used by components in favor of canvasUtilsContext directly,
 * because it grants higher flexibility if you ever need to change the implementation (e.g: use something else than React.Context, like Redux/MobX/Recoil).
 *
 * @see https://slides.com/djanoskova/react-context-api-create-a-reusable-snackbar#/11
 */
const useCanvasUtils = (): CanvasUtils => {
  return React.useContext(canvasUtilsContext);
};

export default useCanvasUtils;
