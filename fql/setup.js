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
        // Editors should be able to edit only Canvas documents that belongs to them.
        write: true,
        // Editors should be able to create only Canvas documents that belongs to them.
        create: true,
      },
    },
  ],
});
