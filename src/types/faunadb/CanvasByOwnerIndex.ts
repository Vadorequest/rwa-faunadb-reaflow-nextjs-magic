import { values } from 'faunadb';

export type CanvasByOwnerIndexData = [
  values.Ref,
];

export type CanvasByOwnerIndex = {
  data: CanvasByOwnerIndexData[];
};
