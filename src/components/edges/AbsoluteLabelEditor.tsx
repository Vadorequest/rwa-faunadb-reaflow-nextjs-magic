import { Button, Input } from '@chakra-ui/react';
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
   * When pressing "Enter", automatically clicks on the submit button.
   *
   * @param event
   */
  const onInputKeyDown = (event: any) => {
    if(event?.code === 'Enter'){
      onIconClick();
    }
  }

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
        display: flex;
        position: absolute;
        left: ${(x || 0)}px;
        top: ${(y || 0)}px;
        background-color: white;
        color: black;
        border-radius: 5px;
        
        input{
        margin: 5px 0px 5px 5px;
        }
      `}
    >
      <Input
        ref={inputRef}
        placeholder={'Label'}
        onChange={onInputChange}
        autoFocus={true}
        value={label}
        onKeyDown={onInputKeyDown}
      />
      <Button
        variant="primary"
      >
        <FontAwesomeIcon
          icon={['fas', 'edit']}
          onClick={onIconClick}
        />
      </Button>
    </div>
  );
};

export default AbsoluteLabelEditor;
