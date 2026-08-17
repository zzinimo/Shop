const test = require("node:test");
const assert = require("node:assert/strict");
const { createUserSchema, loginSchema } = require("../validation/users");
const { authOrderSchema } = require("../validation/orders");

test("user registration requires a valid email, password, and username", async () => {
  await assert.rejects(
    createUserSchema.validateAsync({
      email: "invalid",
      password: "short",
    }),
  );

  const value = await createUserSchema.validateAsync({
    email: "person@example.com",
    password: "secure-password",
    username: "person",
  });

  assert.equal(value.email, "person@example.com");
});

test("login validation rejects missing credentials", async () => {
  await assert.rejects(
    loginSchema.validateAsync({ email: "person@example.com" }),
  );
});

test("authenticated orders require customer, shipping address, and items", async () => {
  await assert.rejects(
    authOrderSchema.validateAsync({
      customer: { email: "person@example.com" },
      shippingAddress: { address: "123 Main Street" },
      items: [],
    }),
  );
});
