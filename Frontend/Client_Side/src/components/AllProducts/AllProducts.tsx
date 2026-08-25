import "./AllProducts.css";
import { useState } from "react";
import { useClothingItems } from "../../useClothingItems.js";
import type { ClothingItem } from "../Products/Products.js";
import AddToCartButton from "../AddToCartButton/AddToCartButton.js";
import { apiBaseUrl } from "../../config.js";
import Modal from "../Modal/Modal.jsx";


function AllProducts() {
  const publicUrl = apiBaseUrl;
  const clothingItems: ClothingItem[] = useClothingItems();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const handleImageClick = (item: ClothingItem) => {
    setSelectedImage(`${publicUrl}${item.src}`);
    setSelectedDescription(item.description);
    setSelectedPrice(item.price);
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <Modal
          selectedImage={selectedImage}
          selectedDescription={selectedDescription}
          selectedPrice={selectedPrice}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="all__products_header">
        <h3 className="all__products_header">{`New Arrivals (${clothingItems.length})`}</h3>
      </div>
      <div className="all__products_container">
        <ul className="all__products">
          {clothingItems.map((item: ClothingItem) => {
            return (
              <li key={item._id} className="all__products_product">
                <AddToCartButton product={{ ...item, _id: item._id, quantity: 1 }} />
                <img
                  src={`${publicUrl}${item.src}`}
                  alt="Product Photo"
                  className="all__products_product-photo"
                  onClick={() => handleImageClick(item)}
                />
                <h6 className="all__products_product_title">Clothing</h6>
                <p className="all__products_product_price">{item.price}</p>
                <p className="all__products_product_descritpion">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default AllProducts;
