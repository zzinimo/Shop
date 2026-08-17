import "./AllProducts.css";
import { useClothingItems } from "../../useClothingItems.js";
import type { ClothingItem } from "../Products/Products.js";
import AddToCartButton from "../AddToCartButton/AddToCartButton.js";
import { apiBaseUrl } from "../../config.ts";


function AllProducts() {
  const publicUrl = apiBaseUrl;
  const clothingItems: ClothingItem[] = useClothingItems(); 

  return (
    <>
    <div className="all__products_header">
      <h3 className="all__products_header">{`New Arrivals (${clothingItems.length})`}</h3>
    </div>
      <div className="all__products_container">
        <ul className="all__products">
          {clothingItems.map((item: ClothingItem) => {
            return(
              <li key={item._id} className="all__products_product">
                <AddToCartButton product={{...item, _id: item._id, quantity: 1}} />
                <img src={`${publicUrl}${item.src}`} alt="" className="all__products_product-photo" />
                <h6 className="all__products_product_title">Clothing</h6>
                <p className="all__products_product_price">{item.price}</p>
                <p className="all__products_product_descritpion">{item.description}</p>
              </li>
            )
          })}
          
        </ul>
      </div>
    </>
  );
}

export default AllProducts;
