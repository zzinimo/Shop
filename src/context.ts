import { createContext } from "react";

export type CartItem = {
	_id: string, 
	quantity: number
}

export type CartContextType = {
	cart: CartItem[], 
	setCart: (cart: CartItem[]) => void
}

export const cartContext = createContext<CartContextType | null>(null); 