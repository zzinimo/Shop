import { useState, useEffect } from "react";
import getClothingItems from "./api.js";
import type { ClothingItem } from "./components/Products/Products.js";

export function useClothingItems(){
	
	const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

	useEffect(()=> {
		const fetchData = async() => {
			const items = await getClothingItems(); 
			setClothingItems(items.items)
		}
		fetchData(); 
	}, []); 

	return clothingItems; 

}