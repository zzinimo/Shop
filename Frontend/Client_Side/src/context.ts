import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type CartItem = {
	_id: string, 
	quantity: number
}

export type CartContextType = {
	cart: CartItem[], 
	setCart: Dispatch<SetStateAction<CartItem[]>>
	isCartOpen: boolean, 
	setIsCartOpen: Dispatch<SetStateAction<boolean>>; 
}

export type LoggedInContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const cartContext = createContext<CartContextType | null>(null);

export const loggedInContext = createContext<LoggedInContextType | null>(null); 