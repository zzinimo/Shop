import "./AddToCartButton.css";
import { useContext } from "react";
import { cartContext } from "../../context.js";
import type { CartItem } from "../../context.js";


type AddToCartButtonPops = {
	product: CartItem
}

//start of component
function AddToCartButton({product}: AddToCartButtonPops){

	const context = useContext(cartContext); 
		if(!context) {
			return null;
		}		
	const {cart, setCart} =context; //cart = shoppingCart setCart = setShoppingCart; 



	function handleAddToCartClick() {
		const itemInCart = cart.find(cartItem => cartItem._id === product._id);
		
		if(itemInCart){
		setCart(cart.map((cartItem): any => {
			return cartItem._id === product._id
			? {...cartItem, quantity: cartItem.quantity + 1}
			: cartItem
		}))
		} else {
			setCart([...cart, {...product, _id: product._id, quantity: 1}]);
		}
	 
	}

	
	return(
		<>
			<button onClick={handleAddToCartClick} type="button" className="add__button">
				Add to Cart
			</button>
		</>
	)
}

export default AddToCartButton; 