// Step 1: Create a "users" collection
CreateCollection({ name: "users" });

// Step 3: Create all relevant Indexes
CreateIndex({
  name: "users_by_email",
  source: Collection("users"),
  terms: [{ field: ["data", "email"] }],
  unique: true
});
