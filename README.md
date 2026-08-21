# E-Commerce Store

Full-stack clothing store built with React, Vite, Express, MongoDB, and Mongoose.

## Features

- Product browsing and product detail modal
- Persistent cart using localStorage
- User registration and cookie-based login
- Guest and authenticated order flows
- Newsletter subscription with duplicate-email protection
- Joi request validation and centralized error responses

## Project Structure

- `Frontend/Client_Side`: canonical Vite frontend
- `Server_Side`: Express API, MongoDB models, authentication, and validation

The active application lives in `Frontend/Client_Side`, with the API in `Server_Side`.

## Local Setup

1. Install MongoDB and start a local database.
2. Install the server dependencies:

   ```bash
   cd Server_Side
   npm install
   ```

3. Install the frontend dependencies:

   ```bash
   cd ../Frontend/Client_Side
   npm install
   ```

4. Copy `Server_Side/.env.example` to `Server_Side/.env` and set strong secrets.
5. Copy `Frontend/Client_Side/.env.example` to `Frontend/Client_Side/.env`.
6. Start the API with `npm start` from `Server_Side`.
7. Start the frontend with `npm run dev` from `Frontend/Client_Side`.

## API Overview

- `GET /clothing-items`
- `POST /login/register`
- `POST /login`
- `POST /login/logout`
- `GET /orders`
- `POST /orders`
- `POST /subscribe`

## Testing

Run server validation tests with `npm test` from `Server_Side`. Run the frontend production check with `npm run build` from `Frontend/Client_Side`.

## Payment Status

The checkout currently creates an order without collecting card details. A real payment provider should be integrated before accepting payments in production.
