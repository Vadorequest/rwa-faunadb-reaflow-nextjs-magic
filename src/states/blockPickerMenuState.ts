import {
  atom,
  selector,
} from 'recoil';
import BlockPickerMenu from '../types/BlockPickerMenu';
import merge from 'lodash.merge';

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
   * Avoids needless updates. (TODO)
   *
   * @param set
   * @param get
   * @param reset
   * @param newValue
   */
  set: ({ set, get, reset }, newValue): void => {
    const existingValue: BlockPickerMenu = get(blockPickerMenuState);
    const patchedValue = {};
    merge(patchedValue, existingValue, newValue);

    console.log('blockPickerMenuSelector set', patchedValue);
    set(blockPickerMenuState, patchedValue as BlockPickerMenu);
  },
});
