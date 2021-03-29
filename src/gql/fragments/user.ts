import { gql } from 'graphql-request';

// XXX https://www.apollographql.com/docs/react/advanced/fragments
const user = {
  /**
   * Base User fields.
   */
  userFields: gql`
    fragment userFields on User {
      id: _id
      email
    }
  `,
};

export default user;
