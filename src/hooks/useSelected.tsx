import React from 'react';
import selectedContext, { SelectedContext } from '../contexts/selectedContext';

/**
 * Hook to access selected elements
 *
 * Uses selectedContext internally (provides an identical API)
 *
 * This hook should be used by components in favor of selectedContext directly,
 * because it grants higher flexibility if you ever need to change the implementation (e.g: use something else than React.Context, like Redux/MobX/Recoil)
 *
 * @see https://slides.com/djanoskova/react-context-api-create-a-reusable-snackbar#/11
 */
const useSelected = (): SelectedContext => {
  return React.useContext(selectedContext) as SelectedContext;
};

export default useSelected;
