// Step 1: Create a "Users" collection
CreateCollection({ name: 'Users' });

// Step 2: Create "Canvas" collection
CreateCollection({ name: 'Canvas' });

// Step 3: Create indexes
CreateIndex({
  name: 'users_by_email',
  source: Collection('Users'),
  terms: [{ field: ['data', 'email'] }],
  unique: true,
});
CreateIndex({
  name: 'canvas_by_owner',
  source: Collection('Canvas'),
  permissions: { read: Collection("Users") },
  terms: [{ field: ['data', 'owner'] }],
  values: [
    { field: ['ref'] },
    { field: ['data', 'nodes'] },
    { field: ['data', 'edges'] },
  ],
});

// Step 4: Create roles
// All users should be editors.
// An editor should be able to edit only Canvas documents that belongs to them.
CreateRole({
  name: 'Editor',
  membership: {
    resource: Collection('Users'),
  },
  privileges: [
    {
      resource: Index('canvas_by_owner'),
      actions: {
        read: true,
      },
    },
    {
      resource: Collection('Canvas'),
      actions: {
        read: Query(
          Lambda("ref", Equals(
            CurrentIdentity(),
            Select(["data", "owner"], Get(Var("ref")))
          ))
        ),
        write: true,
        create: true,
      },
    },
  ],
});
