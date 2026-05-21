const url = "http://localhost:3000/clothing-items";

const getClothingItems = async () => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get clothing items");
  }

  return response.json();
};

export default getClothingItems;
