// ---------------------- Step 1: Create a "Users" collection ----------------------
CreateCollection({ name: 'Users' });

// ---------------------- Step 2: Create "Canvas" collection ----------------------
CreateCollection({ name: 'Canvas' });

// ---------------------- Step 3: Create indexes ----------------------
// Index to filter users by email
// Necessary for authentication, to find the user document based on their email
CreateIndex({
  name: 'users_by_email',
  source: Collection('Users'),
  terms: [
    { field: ['data', 'email'] },
  ],
  unique: true,
});

// Index to filter canvas by owner
// Necessary for real-time subscription, to retrieve the canvas of the current user
CreateIndex({
  name: 'canvas_by_owner',
  source: Collection('Canvas'),
  // Needs permission to read the Users, because "owner" is specified in the "terms" and is a Ref to the "Users" collection
  permissions: {
    read: Collection('Users')
  },
  // Allow to filter by owner ("Users")
  terms: [
    { field: ['data', 'owner'] },
  ],
  // Index contains the Canvas ref (that's the default behavior and could be omitted)
  values: [
    { field: ['ref'] },
  ],
});

// ---------------------- Step 4: Create roles ----------------------

// The "Editor" role is assigned to all authenticated users
// It is automatically assigned when a user is authenticated, because it defines "membership" to the Users collection
// It is secure because the token is generated upon login on the server-side and stored in a "httpOnly" cookie that can only be read/written on the server-side
// The token is specific to the user and is used on the frontend
// The token only allows the user to read/write documents that belongs to him
CreateRole({
  name: 'Editor',
  // All users should be editors (will apply to authenticated users only).
  membership: [{
    resource: Collection('Users'),
  }],
  privileges: [
    {
      // Editors need read access to the canvas_by_owner index to find their own canvas
      resource: Index('canvas_by_owner'),
      actions: {
        read: true,
      },
    },
    {
      resource: Collection('Canvas'),
      actions: {
        // Editors should be able to read (+ history) of Canvas documents that belongs to them.
        read: Query(
          Lambda('ref', Equals(
            CurrentIdentity(),
            Select(['data', 'owner'], Get(Var('ref'))),
          )),
        ),
        history_read: Query(
          Lambda('ref', Equals(
            CurrentIdentity(),
            Select(['data', 'owner'], Get(Var('ref'))),
          )),
        ),
        // Editors should be able to edit only Canvas documents that belongs to them
        write: Lambda(
          ["oldData", "newData", "ref"],
          And(
            // The owner in the current data (before writing them) must be the current user
            Equals(
              CurrentIdentity(),
              Select(["data", "owner"], Var("oldData"))
            ),
            // The owner must not change
            Equals(
              Select(["data", "owner"], Var("oldData")),
              Select(["data", "owner"], Var("newData"))
            )
          )
        ),
        // Editors should be able to create only Canvas documents that belongs to them
        create: Lambda("values", Equals(
          CurrentIdentity(),
          Select(["data", "owner"], Var("values")))
        ),
      },
    },
  ],
});

// The "Public" role is assigned to anyone who isn't authenticated
// It doesn't use "membership" (unlike "Editor" role) but a token created manually that doesn't expire
// It is secure because the token only grant access to the special document of id "1", which is shared amongst all guests
// Guests can only read/write this particular document and not any other
CreateRole({
  name: 'Public',
  // The public role is meant to be used to generate a token which allows anyone (unauthenticated users) to update the canvas
  membership: [],
  privileges: [
    {
      resource: Collection('Canvas'),
      actions: {
        // Guests should only be allowed to read the Canvas of id "1"
        read: Query(
          Lambda('ref',
            Equals(
              '1',
              Select(['id'], Var('ref'),
              ),
            ),
          ),
        ),
        // Guests should only be allowed to update the Canvas of id "1"
        write: Lambda(
          ['oldData', 'newData', 'ref'],
          Equals(
            '1',
            Select(['id'], Var('ref')),
          ),
        ),
        // Guests should only be allowed to create the Canvas of id "1"
        create: Lambda('values',
          Equals(
            '1',
            Select(['ref', 'id'], Var('values')),
          ),
        ),
        // Creating a record with a custom ID requires history_write privilege
        // See https://fauna-community.slack.com/archives/CAKNYCHCM/p1615413941454700
        history_write: Lambda(
          ['ref', 'ts', 'action', 'data'],
          Equals(
            '1',
            Select(['id'], Var('ref')),
          ),
        ),
      },
    },
  ],
});
