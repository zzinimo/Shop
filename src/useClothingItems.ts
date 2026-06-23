import { useState, useEffect } from "react";
import getClothingItems from "./api.js";
import type { ClothingItem } from "./components/Products/Products.js";

export function useClothingItems(){
	
	const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

	useEffect(()=> {
		const fetchData = async() => {
			try{
				const items = await getClothingItems(); 
				if(items){
					setClothingItems(items.items)
				}
			} catch(error){
				console.error("Failed to fetch clothing items:", error)
			}
			
		}
		fetchData(); 
	}, []); 

	return clothingItems; 

}