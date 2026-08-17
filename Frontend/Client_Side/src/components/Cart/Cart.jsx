import "./Cart.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { cartContext } from "../../context.js";
import deleteButton from "../../assets/delete.png";

function Cart({ className = "" }) {
  const { cart, setIsCartOpen, setCart } = useContext(cartContext);
  const navigate = useNavigate();

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

  const handleAddProductsClick = () => {
    console.log("going to products");
    navigate("/all-products");
    setIsCartOpen(false);
  };

  const handleDeleteProductsClick = (id) => {
    setCart(
      cart.filter((cartItem) => {
        return cartItem._id !== id;
      }),
    );
  };

  const handleCheckoutClick = () => {
    navigate("/checkout");
    setIsCartOpen(false);
  };

  return (
    <div className={`cart__container ${className}`}>
      <h1 className="cart__container_title">Your Cart</h1>
      {cart.length > 0 ? (
        <>
          <p className="cart__container_description">Products</p>
          <ul className="cart__container_list">
            {cart.map((cartItem) => {
              return (
                <div className="list__item_container" key={cartItem._id}>
                  <li className="cart__container_list_item">
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${cartItem.src}`}
                      alt=""
                      className="cart__container_list_item_img"
                    />
                    <p className="cart__container_list_item_price">
                      {cartItem.description}
                    </p>
                    <p className="cart__container_list_item_price">
                      {cartItem.price} x {cartItem.quantity ?? 1}
                    </p>
                    <button
                      type="button"
                      className="cart__container_delete_button"
                      onClick={() => handleDeleteProductsClick(cartItem._id)}
                    >
                      <img
                        src={deleteButton}
                        alt="Delete Button"
                        className="cart__container_delete_button_img"
                      />
                    </button>
                  </li>
                </div>
              );
            })}
          </ul>
          <p className="cart__container_total">Total: ${subtotal.toFixed(2)}</p>
          <button
            onClick={handleCheckoutClick}
            type="button"
            className="cart__container_checkout_button"
          >
            Checkout
          </button>
        </>
      ) : (
        <>
          <div className="cart__empty_container">
            <p className="cart__container_empty_description">
              Your cart is empty
            </p>
            <button
              type="button"
              className="cart__container_products_button"
              onClick={handleAddProductsClick}
            >
              Add Products
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
