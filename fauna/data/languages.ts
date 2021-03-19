import { DataResource } from 'fauna-gql-upload';

const languages: DataResource = {
  collection: "Languages",
  index: "languages_by_key",
  key: "key",
  data: [
    { key: "en", name: "English" },
    { key: "es", name: "Spanish" },
    { key: "fr", name: "French" },
  ],
}

export default languages;
