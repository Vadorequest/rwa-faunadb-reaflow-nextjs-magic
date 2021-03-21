/**
 * XXX This file is simply a collection of examples and code snippets I've used.
 */

Create(
  Collection('Canvas'),
  {
    data: {
      owner: Ref(Collection("Users"), "292674252603130373"),
      nodes: [],
      edges: [],
    }
  },
)

Lambda("ref", Equals(
  CurrentIdentity(),
  Select(["data", "owner"], Get(Var("ref")))
))
