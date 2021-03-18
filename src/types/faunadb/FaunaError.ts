export interface FaunaError extends Error {
  name: string;
  message: string;
  description: string;
}
