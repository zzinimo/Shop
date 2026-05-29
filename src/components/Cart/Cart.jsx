import "./Cart.css";
import { useContext } from "react";
import { cartContext } from "../../context.js";

function Cart({ className = "" }) {
  const { cart, setCart } = useContext(cartContext);

  console.log("cart", cart);
  return (
    <div className={`cart__container ${className}`}>
      <h1 className="cart__container_title">Cart Items</h1>
      <p className="cart__container_description">
        This is the cart descriptions
      </p>
      <p style={{ color: "yellow", fontWeight: "bold" }}></p>
    </div>
  );
}

export default Cart;
