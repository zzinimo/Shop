import "./Products.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal.jsx";

import AddToCartButton from "../AddToCartButton/AddToCartButton.js";


//function imports
import { useClothingItems } from "../../useClothingItems.js";

export type ClothingItem = {
  _id: string, 
  src: string, 
  price: string, 
  description: string, 
}

function Products() {
  const clothingItems = useClothingItems();
  const navigate = useNavigate(); 
  //useEffect to fetch clothing items on component render
  

  const [isOpen, setIsOpen] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    setIsOpen(true);
    setSelectedImage((e.target as HTMLImageElement).src);
  };


    const handleViewProductButtonClick = () => {
      navigate('/all-products'); 
    }
  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          selectedImage={selectedImage}
          setIsOpen={setIsOpen}
        />
      )}
      <h2 className="products__title">Products</h2>
      <div className="products__container">
        <ul className="products">
          {clothingItems.map((item: ClothingItem) => {
            return (
              <li key={item._id} className="product">
                <AddToCartButton product={{ ...item, _id: item._id, quantity: 1 }} /> 
                <img
                  src={`http://localhost:3000${item.src}`}
                  alt="Product Photo"
                  className="product__photo"
                  onClick={handleImageClick}
                />
                <h6 className="product__title">Clothing</h6>
                <p className="product__price">{item.price}</p>
                <p className="product__description">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <button 
      type="button" 
      className="products__container_button"
      onClick={handleViewProductButtonClick}>
        View all products
      </button>
    </>
  );
}

export default Products;
