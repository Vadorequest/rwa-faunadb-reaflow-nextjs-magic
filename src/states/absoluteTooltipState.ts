import { atom } from 'recoil';
import { AbsoluteTooltipContent } from '../types/AbsoluteTooltipContent';

/**
 * Used to know the state of the tooltip currently being displayed.
 *
 * The tooltip will be displayed in absolute position.
 */
export const absoluteTooltipState = atom<AbsoluteTooltipContent | undefined>({
  key: 'absoluteTooltipState',
  default: undefined,
});
