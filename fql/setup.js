// Step 1: Create a "Users" collection
CreateCollection({ name: 'Users' });

// Step 2: Create "Canvas" collection
CreateCollection({ name: 'Canvas' });

// Step 3: Create indexes
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
  permissions: { read: Collection('Users') },
  // Allow to filter by owner ("Users")
  terms: [
    { field: ['data', 'owner'] },
  ],
  // Index contains the Canvas ref (that's the default behavior and could be omitted)
  values: [
    { field: ['ref'] },
  ],
});

// Step 4: Create roles
CreateRole({
  name: 'Editor',
  // All users should be editors (will apply to authenticated users only).
  membership: {
    resource: Collection('Users'),
  },
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
        // Editors should be able to read (+ history) only Canvas documents that belongs to them.
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
        // Editors should be able to edit only Canvas documents that belongs to them (but I don't know how to write that).
        write: true,
        // Editors should be able to create only Canvas documents that belongs to them (but I don't know how to write that).
        create: true,
      },
    },
  ],
});

CreateRole({
  name: 'Public',
  // The public role is meant to be used to generate a token which allows anyone (unauthenticated users) to update the canvas
  membership: {},
  privileges: [
    {
      resource: Collection('Canvas'),
      actions: {
        // Guests should only be allowed to read the Canvas of id "1"
        read: Query(
          Lambda('ref',
            Equals(
              '1',
              Select(['id'], Get(Var('ref')),
              ),
            )),
        ),
        // Guests should only be allowed to update the Canvas of id "1" (but I don't know how to write that)
        write: Lambda(
          ['oldData', 'newData'],
          And(
            Equals(
              '1',
              Select(['ref', 'id'], Get(Var('newData'))),
            ),
            Equals(
              Select(['data', 'owner'], Var('oldData')),
              Select(['data', 'owner'], Var('newData')),
            ),
          ),
        ),
        // Guests should only be allowed to create the Canvas of id "1", but this requires admin permissions and will fail
        // See https://fauna-community.slack.com/archives/CAKNYCHCM/p1615413941454700
        create: Lambda('values',
          Equals(
            '1',
            Select(['ref', 'id'], Get(Var('values'))),
          ),
        )
        ,
        history_write: Lambda(
          ['ref', 'ts', 'action', 'data'],
          And(
            Equals(
              '1',
              Select(['id'], Get(Var('ref'))),
            ),
            Equals(
              Select(['data', 'owner'], Var('data')),
              Select(['data', 'owner'], Get(Var('ref'))),
            ),
          ),
        ),
      },
    },
  ],
});
