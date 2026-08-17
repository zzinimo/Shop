import { apiBaseUrl } from "./config.ts";

const clothingUrl = `${apiBaseUrl}/clothing-items`;
const orderUrl = `${apiBaseUrl}/orders`;
const userUrl = `${apiBaseUrl}/login`;
const subscriberUrl = `${apiBaseUrl}/subscribe`;

const checkResponse = async (
  response,
  fallbackMessage = "Failed to complete server request",
) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    console.log("error in catch of check response ");
  }

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

export const subScribeEmail = async (email) => {
  const response = await fetch(subscriberUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return checkResponse(response);
};

//clothing
export const getClothingItems = async () => {
  const response = await fetch(clothingUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not fetch clothing items");
};

//orders

//do I need getOrder function? Maybe for a different frontend page?
export const getOrder = async () => {
  const response = await fetch(orderUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not get order");
};

export const getOrderById = async (id) => {
  const response = await fetch(`${orderUrl}/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not get order by Id");
};

export const createOrder = async (orderPayload) => {
  const response = await fetch(orderUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  return checkResponse(response, "Error creating order");
};

export const updateStatus = async (id, status, updatePayload) => {
  const response = await fetch(`${orderUrl}/${id}/${status}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatePayload),
  });

  return checkResponse(response, "Error updating status");
};

export const cancelOrder = async (id) => {
  const response = await fetch(`${orderUrl}/${id}/cancel`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not cancel order");
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${orderUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Error deleting order");
};

//users

export const createUser = async ({ email, password, username }) => {
  const response = await fetch(`${userUrl}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      username,
    }),
  });

  return checkResponse(response, "Error creating user");
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(userUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return checkResponse(response, "Error logging in");
};

export const logoutUser = async () => {
  const response = await fetch(`${userUrl}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Error logging out");
};
