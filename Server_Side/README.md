# Backend API

Express/MongoDB backend for the E-Commerce Store frontend.

## Live API

- Railway base URL: https://shop-production-64fa.up.railway.app

Note: `GET /` is not defined, so visiting the base URL directly returns `Cannot GET /`.
Use the route endpoints below.

## Overview

This API handles:

- product retrieval
- user registration/login/logout
- authenticated and guest order flows
- newsletter subscription storage

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Joi validation
- JWT + cookie auth
- Helmet + rate limiting + CORS

## Environment Variables

Create `Server_Side/.env` from `Server_Side/.env.example` and set:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `FRONTEND_URL`
- `JWT_SECRET`
- `GUEST_ORDER_SECRET`

## Local Setup

```bash
cd Server_Side
npm install
npm start
```

## Testing

```bash
npm test
```

## API Routes

### Clothing

- `GET /clothing-items`
  - Returns all clothing items.

### Auth / Users

- `POST /login/register`
  - Registers a user.
- `POST /login`
  - Logs in a user and sets the auth cookie.
- `POST /login/logout`
  - Clears the auth cookie.
- `GET /login/me`
  - Returns current user profile (requires auth cookie).

### Orders

- `POST /orders`
  - Creates an order.
  - Authenticated flow expects `customer`, `shippingAddress`, and `items`.
  - Guest flow expects `guestEmail`, `shippingAddress`, and `items`.
- `GET /orders`
  - Returns current authenticated user's orders.
- `GET /orders/:id`
  - Returns one authenticated user's order.
- `PATCH /orders/:id/status`
  - Updates order status.
- `PATCH /orders/:id/cancel`
  - Cancels an order.
- `DELETE /orders/:id`
  - Deletes an order.

### Subscribe

- `POST /subscribe`
  - Adds subscriber email.

## Auth and Session Notes

- Auth token is stored in an HTTP-only cookie (`user`).
- Guest checkout creates a short-lived guest order cookie (`guestOrder`).
- Protected order routes use `checkToken` + `getUserFromDb` middleware.

## Validation and Error Handling

- Joi validates request payloads for users, orders, and subscriber email.
- Centralized error middleware returns:
  - `success`
  - `status`
  - `message`
  - `stack` (development only)

## Challenges and Lessons Learned

- CORS setup required strict origin alignment between Vercel and Railway.
- Guest vs authenticated checkout required separate validation contracts.
- Hardcoded local values were replaced with environment variables for deployment.
- Startup was updated so the server only listens after MongoDB connects.

## Future Improvements

- Add a health route (for example `GET /health`) for uptime checks.
- Add integration tests for route-level behavior.
- Add structured logging and monitoring.
- Integrate a production payment provider flow end-to-end.
