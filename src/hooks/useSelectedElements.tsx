import React from 'react';
import selectedElementsContext, { SelectedElementsContext } from '../contexts/selectedElementsContext';

/**
 * Hook to access selected elements
 *
 * Uses selectedElementsContext internally (provides an identical API)
 *
 * This hook should be used by components in favor of selectedElementsContext directly,
 * because it grants higher flexibility if you ever need to change the implementation (e.g: use something else than React.Context, like Redux/MobX/Recoil)
 *
 * @see https://slides.com/djanoskova/react-context-api-create-a-reusable-snackbar#/11
 */
const useSelectedElements = (): SelectedElementsContext => {
  return React.useContext(selectedElementsContext) as SelectedElementsContext;
};

export default useSelectedElements;
