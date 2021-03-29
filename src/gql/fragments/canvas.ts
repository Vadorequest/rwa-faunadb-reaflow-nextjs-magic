import { gql } from 'graphql-request';

// XXX https://www.apollographql.com/docs/react/advanced/fragments
const canvas = {
  /**
   * Base Canvas fields.
   */
  canvasFields: gql`
    fragment canvasFields on Canvas {
      id: _id
      lastUpdatedBySessionEphemeralId
      lastUpdatedByUserName
    }
  `,
};

export default canvas;
