import { createContext } from "react";

export type CartItem = {
	_id: string, 
	quantity: number
}

export type CartContextType = {
	cart: CartItem[], 
	setCart: (cart: CartItem[]) => void
	isCartOpen: boolean, 
	setIsCartOpen: (value: any) => void; 
}

export type LoggedInContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: (value: boolean) => void;
}

export const cartContext = createContext<CartContextType | null>(null);

export const loggedInContext = createContext<LoggedInContextType | null>(null); 