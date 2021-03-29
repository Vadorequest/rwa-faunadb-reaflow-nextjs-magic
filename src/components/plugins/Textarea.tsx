import { css } from '@emotion/react';
import React from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { useDebouncedCallback } from 'use-debounce';
import settings from '../../settings';

type Props = {} & TextareaAutosizeProps;

/**
 * Textarea with autoresize and sane default props.
 *
 * Wrapper around the TextareaAutosize component.
 *
 * @see https://github.com/Andarist/react-textarea-autosize
 * @see http://andarist.github.io/react-textarea-autosize/
 */
export const Textarea: React.FunctionComponent<Props> = (props) => {
  const {
    minRows = 1,
    maxRows = 5,
    onHeightChange,
    ...rest
  } = props;

  /**
   * Debounces notifications sent when the input's height changes.
   *
   * The input's height is dynamic and depends on the content.
   * It is debounced to avoid sending too much updates in a burst when jumping several lines at once.
   */
  const debouncedOnHeightChange = useDebouncedCallback(
    (height: number, meta: TextareaHeightChangeMeta) => {
      onHeightChange?.(height, meta);
    },
    settings.canvas.nodes.defaultDebounceWaitFor, // Wait for other changes to happen, if no change happen then invoke the update
  );

  return (
    <TextareaAutosize
      minRows={minRows}
      maxRows={maxRows}
      {...rest}
      onHeightChange={debouncedOnHeightChange}
      css={css`
        resize: none;
        width: 100%;
        padding-left: 5px;
      `}
    />
  );
};

export default Textarea;
