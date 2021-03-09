import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  FC,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { absoluteLabelEditorState } from '../../states/absoluteLabelEditorStateState';

type Props = {}

/**
 * Label editor displayed in absolute position.
 *
 * Displays on top of the canvas.
 */
const AbsoluteLabelEditor: FC<Props> = (props) => {
  const [label, setLabel] = useState<string>('');
  const [absoluteLabelEditor, setAbsoluteLabelEditor] = useRecoilState(absoluteLabelEditorState);
  const {
    isDisplayed,
    x,
    y,
    onSubmit,
  } = absoluteLabelEditor || {};

  if (!isDisplayed) {
    return null;
  }

  const onInputChange = (event: any) => {
    setLabel(event.target.value);
  };

  const onIconClick = () => {
    onSubmit?.(label);

    setAbsoluteLabelEditor({
      isDisplayed: false,
    });
  }

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
        placeholder={'Label'}
        onChange={onInputChange}
        autoFocus={true}
      />
      <FontAwesomeIcon
        icon={['fas', 'edit']}
        onClick={onIconClick}
      />
    </div>
  );
};

export default AbsoluteLabelEditor;
