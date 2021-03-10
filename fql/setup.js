// Step 1: Create a "users" collection
CreateCollection({ name: "Users" });
CreateCollection({ name: "Canvas" });

// Step 3: Create all relevant Indexes
CreateIndex({
  name: "users_by_email",
  source: Collection("Users"),
  terms: [{ field: ["data", "email"] }],
  unique: true
});
