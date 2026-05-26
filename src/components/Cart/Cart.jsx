import { useContext } from "react";
import { cartContext } from "../../context.js";

function Cart() {
  const { cart, setCart } = useContext(cartContext);
  return <></>;
}

export default Cart;
