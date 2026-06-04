import "./Cart.css";
import { useContext } from "react";
import { cartContext } from "../../context.js";

function Cart({ className = "" }) {
  const { cart } = useContext(cartContext);

  const subtotal = cart.reduce((total, cartItem) => {
    const numericPrice = Number(
      String(cartItem.price).replace("$", "").replaceAll(",", ""),
    );
    const quantity = Number(cartItem.quantity ?? 1);

    if (Number.isNaN(numericPrice) || Number.isNaN(quantity)) {
      return total;
    }

    return total + numericPrice * quantity;
  }, 0);

  console.log("cart Cart.jsx", cart);
  return (
    <div className={`cart__container ${className}`}>
      <h1 className="cart__container_title">Cart Items</h1>
      <p className="cart__container_description">
        This is the cart descriptions
      </p>
      <ul className="cart__container_list">
        {cart.map((cartItem) => {
          return (
            <div className="list__item_container" key={cartItem._id}>
              <li className="cart__container_list_item">
                <img
                  src={`http://localhost:3000${cartItem.src}`}
                  alt=""
                  className="cart__container_list_item_img"
                />
                <p className="cart__container_list_item_price">
                  {cartItem.description}
                </p>
                <p className="cart__container_list_item_price">
                  {cartItem.price} x {cartItem.quantity ?? 1}
                </p>
              </li>
            </div>
          );
        })}
      </ul>
      {cart.length > 0 ? <p>Total: ${subtotal.toFixed(2)}</p> : ""}
    </div>
  );
}

export default Cart;
