import { atom } from 'recoil';
import { AbsoluteLabelEditorContent } from '../types/AbsoluteLabelEditorContent';

/**
 * Used to know the state of the labelEditor currently being displayed.
 *
 * The label will be displayed in absolute position.
 */
export const absoluteLabelEditorState = atom<AbsoluteLabelEditorContent | undefined>({
  key: 'absoluteLabelEditorState',
  default: undefined,
});
