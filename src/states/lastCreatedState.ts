import { atom } from 'recoil';
import { LastCreated } from '../types/LastCreated';

/**
 * Used to know which node was created last and at what time.
 */
export const lastCreatedState = atom<LastCreated | undefined>({
  key: 'lastCreatedState',
  default: undefined,
});
