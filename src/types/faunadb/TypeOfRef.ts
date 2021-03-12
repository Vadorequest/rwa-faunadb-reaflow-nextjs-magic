import { values } from 'faunadb';

/**
 * Helper to avoid importing "values.Ref" everywhere, and avoid conflict with actual Ref function.
 */
export type TypeOfRef = values.Ref;
