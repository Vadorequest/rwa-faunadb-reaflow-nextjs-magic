import styled from '@emotion/styled';

/**
 * Base style used by all preview blocks.
 */
const BasePreviewBlock = styled.button`
  height: 100px;
  width: 100px;
  cursor: grab;
  background: #f5f5f5;
  color: black;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex: 1;
`;

export default BasePreviewBlock;
