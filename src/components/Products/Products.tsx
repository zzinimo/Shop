import "./Products.css";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

//function imports
import getClothingItems from "../../../api";

function Products() {
  const [clothingItems, setClothingItems] = useState([]);
  //useEffect to fetch clothing items on component render
  useEffect(() => {
    const fetchData = async () => {
      const items = await getClothingItems();
      setClothingItems(items.items);
    };
    fetchData();
  }, []);

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
              <li key={index} className="product">
                <img
                  src={`http://localhost:3000${item.src}`}
                  alt="Product Photo"
                  className="product__photo"
                  onClick={handleImageClick}
                />
                <h6 className="product__title">Clothing</h6>
                <p className="product__price">{item.Price}</p>
                <p className="product__description">{item.description}</p>
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
