import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import now from 'lodash.now';
import {
  atom,
  selector,
} from 'recoil';
import BlockPickerMenu from '../types/BlockPickerMenu';

/**
 * Used to know the state of the block picker menu, whether it's displayed, where, etc..
 */
export const blockPickerMenuState = atom<BlockPickerMenu>({
  key: 'blockPickerMenuState',
  default: {
    isDisplayed: false,
  },
});

/**
 * Custom selector for the atom.
 */
export const blockPickerMenuSelector = selector<BlockPickerMenu>({
  key: 'blockPickerMenuSelector',
  get: ({ get }): BlockPickerMenu => {
    return get(blockPickerMenuState);
  },

  /**
   * Patches the new value with the existing value to keep the state of own properties until they're specifically overridden.
   *
   * XXX This way, when only setting "isDisplayed", it'll keep the other properties intact (e.g: fromPort)
   *  which will allow us to know from which port it was initially opened even if it has been closed since.
   *
   * Avoids needless updates.
   *
   * @param set
   * @param get
   * @param reset
   * @param patch
   */
  set: ({ set, get, reset }, patch): void => {
    const currentValue: BlockPickerMenu = get(blockPickerMenuState);
    const newValue: Partial<BlockPickerMenu> = {};
    merge(newValue, currentValue, patch);

    if (!isEqual(currentValue, newValue)) {
      newValue.at = now(); // Automatically update the timestamp of creation
      set(blockPickerMenuState, newValue as BlockPickerMenu);
    } else {
      console.log('blockPickerMenuSelector identical to current value (not set)', newValue);
    }
  },
});
