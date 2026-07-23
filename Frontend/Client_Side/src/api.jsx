const clothingUrl = "http://localhost:3000/clothing-items";
const orderUrl = "http://localhost:3000/orders";

const checkResponse = async (
  response,
  fallbackMessage = "Failed to complete server request",
) => {
  let data = null;

  try {
    data = await response.json();
  } catch (err) {
    console.log("error in catch of check response ");
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not get order");
};

export const getOrderById = async (id) => {
  const response = await fetch(`${orderUrl}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not get order by Id");
};

export const createOrder = async (orderPayload) => {
  const response = await fetch(orderUrl, {
    method: "POST",
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Could not cancel order");
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${orderUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse(response, "Error deleting order");
};
