import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import { absoluteLabelEditorState } from '../../states/absoluteLabelEditorStateState';

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
    onSubmit,
  } = absoluteLabelEditor || {};

  if (!isDisplayed) {
    return null;
  }

  const onChange = (event: any) => {
    console.log('value', event.target.value);

    if (typeof onSubmit === 'function') {
      onSubmit(event.target.value);
    }
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
        placeholder={'Label'}
        onChange={onChange}
        autoFocus={true}
      />
      <FontAwesomeIcon
        icon={['fas', 'edit']}
      />
    </div>
  );
};

export default AbsoluteLabelEditor;
