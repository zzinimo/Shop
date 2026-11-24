// Route tests for /orders. These hit the real Express app through Supertest,
// but replace the Mongoose model methods with fakes (node:test `mock`), so
// they run without a MongoDB connection.
process.env.JWT_SECRET = "test-secret";

const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../app");
const Order = require("../models/orders");
const ClothingItem = require("../models/clothingItems");
const User = require("../models/users");

const newId = () => new mongoose.Types.ObjectId();

const JACKET_ID = newId();
const fakeProducts = [{ _id: JACKET_ID, price: "$90.00" }];

const orderBody = (overrides = {}) => ({
  guestEmail: "guest@example.com",
  shippingAddress: { address: "123 Main Street" },
  items: [
    {
      productId: JACKET_ID.toString(),
      quantity: 2,
      price: 0.01, // tampered price: the server must ignore this
      src: "/images/denimJacket.jpg",
      description: "Denim jacket",
    },
  ],
  ...overrides,
});

// Log in as a user by creating the same cookie the login route would set.
const loginAs = (user) => {
  mock.method(User, "findById", async () => user);
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
  return `user=${token}`;
};

afterEach(() => mock.restoreAll());

// --- Pricing ---------------------------------------------------------------

test("guest order is charged the database price, not the price sent by the client", async () => {
  mock.method(ClothingItem, "find", async () => fakeProducts);
  const create = mock.method(Order, "create", async (doc) => ({
    _id: newId(),
    ...doc,
  }));

  const res = await request(app).post("/orders").send(orderBody());

  assert.equal(res.status, 200);
  const saved = create.mock.calls[0].arguments[0];
  assert.equal(saved.items[0].price, 90);
  assert.equal(saved.totals.subtotal, 180);
  assert.equal(saved.totals.total, 180);
});

test("logged-in order is also charged the database price", async () => {
  const cookie = loginAs({ _id: newId(), role: "customer" });
  mock.method(ClothingItem, "find", async () => fakeProducts);
  const create = mock.method(Order, "create", async (doc) => doc);

  const body = orderBody({
    customer: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    },
  });
  delete body.guestEmail;

  const res = await request(app).post("/orders").set("Cookie", cookie).send(body);

  assert.equal(res.status, 201);
  assert.equal(create.mock.calls[0].arguments[0].totals.total, 180);
});

test("ordering a product that does not exist returns 400", async () => {
  mock.method(ClothingItem, "find", async () => []);
  const create = mock.method(Order, "create", async (doc) => doc);

  const res = await request(app).post("/orders").send(orderBody());

  assert.equal(res.status, 400);
  assert.equal(create.mock.callCount(), 0);
});

// --- Ownership -------------------------------------------------------------

test("a user cannot delete someone else's order, and nothing is deleted", async () => {
  const cookie = loginAs({ _id: newId(), role: "customer" });
  const deleteOne = mock.fn(async () => {});
  mock.method(Order, "findById", async () => ({ userId: newId(), deleteOne }));

  const res = await request(app)
    .delete(`/orders/${newId()}`)
    .set("Cookie", cookie);

  assert.equal(res.status, 403);
  assert.equal(deleteOne.mock.callCount(), 0);
});

test("a user can delete their own order", async () => {
  const userId = newId();
  const cookie = loginAs({ _id: userId, role: "customer" });
  const deleteOne = mock.fn(async () => {});
  mock.method(Order, "findById", async () => ({ userId, deleteOne }));

  const res = await request(app)
    .delete(`/orders/${newId()}`)
    .set("Cookie", cookie);

  assert.equal(res.status, 200);
  assert.equal(deleteOne.mock.callCount(), 1);
});

test("viewing a guest order (no userId) returns 403 instead of crashing", async () => {
  const cookie = loginAs({ _id: newId(), role: "customer" });
  mock.method(Order, "findById", async () => ({
    guestEmail: "guest@example.com",
  }));

  const res = await request(app).get(`/orders/${newId()}`).set("Cookie", cookie);

  assert.equal(res.status, 403);
});

// --- Status updates --------------------------------------------------------

test("a customer cannot change an order's status", async () => {
  const cookie = loginAs({ _id: newId(), role: "customer" });
  const update = mock.method(Order, "findByIdAndUpdate", async () => ({}));

  const res = await request(app)
    .patch(`/orders/${newId()}/status`)
    .set("Cookie", cookie)
    .send({ status: "shipped" });

  assert.equal(res.status, 403);
  assert.equal(update.mock.callCount(), 0);
});

test("an admin can change an order's status", async () => {
  const cookie = loginAs({ _id: newId(), role: "admin" });
  mock.method(Order, "findByIdAndUpdate", async (id, changes) => ({
    _id: id,
    ...changes,
  }));

  const res = await request(app)
    .patch(`/orders/${newId()}/status`)
    .set("Cookie", cookie)
    .send({ status: "shipped" });

  assert.equal(res.status, 200);
  assert.equal(res.body.order.status, "shipped");
});
