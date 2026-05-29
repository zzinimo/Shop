import "./Header.css";
import { useContext, useEffect } from "react";
import { cartContext } from "../../context.js";
import sideThumbnail from "../../assets/menu.png";
import OptionsPanel from "../OptionsPanel/OptionsPanel.jsx";
import cartIcon from "../../assets/myCart.png"; 

type HeaderProps = {
  isPanelOpen: boolean, 
  setIsPanelOpen: (value:boolean) => void;
  isCartOpen: boolean, 
  setIsCartOpen: () => void; 
}

function Header({ isPanelOpen, setIsPanelOpen }: HeaderProps) {
 ; 

  const context = useContext(cartContext); 
  if(!context){
    return null;
  }
  const {cart, isCartOpen, setIsCartOpen} = context;  

  const handleThumbnailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPanelOpen(true);
  };

   const handleCartClick = () => {
    setIsCartOpen((pValue: any) => !pValue);
    console.log("is cart open?", isCartOpen);
  };


  return (
    <>
      <OptionsPanel isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <nav className="header__nav_bar">
        <h1 className="header__nav_bar_title">The Collection</h1>
        <div className="header__nave_bar_button_container">
            <button className="header__cart_button" onClick={handleCartClick}>
              <p className="header__cart_button_counter">{cart.length}</p>
          <img src={cartIcon} alt="Cart Icon" className="header__cart_button_img" />
        </button>
        <button
          className="header__nav_bar_button"
          type="button"
          onClick={handleThumbnailClick}
        >
          <img
            src={sideThumbnail}
            alt="Options Thumbnail"
            className="header__nav_bar_thumbnail"
          />
        </button>

        </div>
        
      </nav>
    </>
  );
}

export default Header;
