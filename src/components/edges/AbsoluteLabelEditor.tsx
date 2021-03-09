import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  FC,
  useEffect,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { absoluteLabelEditorState } from '../../states/absoluteLabelEditorStateState';
import useFocus from '../../hooks/useFocus';

type Props = {}

/**
 * Label editor displayed in absolute position.
 *
 * Displays on top of the canvas.
 */
const AbsoluteLabelEditor: FC<Props> = (props) => {
  const [absoluteLabelEditor, setAbsoluteLabelEditor] = useRecoilState(absoluteLabelEditorState);
  const {
    isDisplayed,
    x,
    y,
    defaultValue,
    onSubmit,
  } = absoluteLabelEditor || {};
  const [label, setLabel] = useState<string>('');
  const [inputRef, setInputFocus] = useFocus();

  /**
   * Apply the defaultValue as value when it changes.
   *
   * Used to pre-load the current value of the input.
   */
  useEffect(() => {
    setLabel(defaultValue?.trim() || '');
  }, [defaultValue]);

  /**
   * Always focus on the input when any state change is made.
   *
   * Forces re-focus when going from one label editor to another.
   */
  useEffect(() => {
    setInputFocus();
  });

  if (!isDisplayed) {
    return null;
  }

  /**
   * When the content of the input changes.
   *
   * @param event
   */
  const onInputChange = (event: any) => {
    setLabel(event.target.value);
  };

  /**
   * The icon acts as submit button.
   */
  const onIconClick = () => {
    onSubmit?.(label);

    setAbsoluteLabelEditor({
      isDisplayed: false,
    });
  };

  return (
    <div
      css={css`
        position: absolute;
        left: ${(x || 0)}px;
        top: ${(y || 0)}px;
        background-color: white;
        color: black;
      `}
    >
      <Input
        ref={inputRef}
        placeholder={'Label'}
        onChange={onInputChange}
        autoFocus={true}
        value={label}
      />
      <FontAwesomeIcon
        icon={['fas', 'edit']}
        onClick={onIconClick}
      />
    </div>
  );
};

export default AbsoluteLabelEditor;
