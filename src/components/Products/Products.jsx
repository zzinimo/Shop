import "./Products.css";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

//photos
import Tshirts from "../../assets/Products/TshirtsMultiColored.jpg";
import whiteT from "../../assets/Products/whiteTModeled.jpg";
import yellowJumpSuit from "../../assets/Products/yellowJumpsuitFull.jpg";
import blackSuitFull from "../../assets/Products/blackSuitFull.jpg";

function Products() {
  const [clothingItems, setClothingItems] = useState([
    Tshirts,
    whiteT,
    yellowJumpSuit,
    blackSuitFull,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (e) => {
    setIsOpen(true);
    setSelectedImage(e.target.src);
  };
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
          {clothingItems.map((item, index) => {
            return (
              <li key={index} className="product" onClick={handleImageClick}>
                <img
                  src={item}
                  alt="Product Photo"
                  className="product__photo"
                />
                <h6 className="product__title">Clothing</h6>
                <p className="product__price">$18</p>
                <p className="product__description">
                  Warm jumpsut great for any weather. very comfy!
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <button type="button" className="products__container_button">
        View all products
      </button>
    </>
  );
}

export default Products;
