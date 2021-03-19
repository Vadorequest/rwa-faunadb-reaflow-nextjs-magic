import { IndexResource } from 'fauna-gql-upload';
import { Collection } from 'faunadb';

/**
 * Sort people by age ASC.
 *
 * XXX Not actually used in the app, kept as example/experimentation.
 *
 * @see https://github.com/Plazide/fauna-gql-upload#uploading-functions
 */
const people_sort_by_age_asc: IndexResource = {
  name: 'people_sort_by_age_asc',
  source: Collection('People'),
  values: [
    { field: ['data', 'age'] },
    { field: ['ref'] },
  ],
};

export default people_sort_by_age_asc;
