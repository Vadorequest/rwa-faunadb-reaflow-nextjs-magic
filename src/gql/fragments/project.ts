import { gql } from 'graphql-request';

// XXX https://www.apollographql.com/docs/react/advanced/fragments
const project = {
  /**
   * Base Project fields.
   */
  projectFields: gql`
    fragment projectFields on Project {
      id: _id
      label
    }
  `,
};

export default project;
