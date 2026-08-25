import "./Header.css";
import { useContext, useEffect, useRef, useState } from "react";
import { cartContext, loggedInContext } from "../../context.js";
import sideThumbnail from "../../assets/menu.png";
import OptionsPanel from "../OptionsPanel/OptionsPanel.jsx";
import cartIcon from "../../assets/myCart.png"; 
import SignInForm from "../SignInForm/SignInForm.jsx";
import { logoutUser } from "../../api.jsx";

type HeaderProps = {
  isPanelOpen: boolean, 
  setIsPanelOpen: (value:boolean) => void;
  isCartOpen: boolean, 
  setIsCartOpen: () => void; 
}

function Header({ isPanelOpen, setIsPanelOpen }: HeaderProps) {
 const [openModal, setOpenModal] = useState<"sign-in" | "sign-up" | null>(null); 
 const [justSignedOut, setJustSignedOut] = useState(false);
 const signedOutTimeoutRef = useRef<number | null>(null);


  const cartCtx = useContext(cartContext); 
  if(!cartCtx){
    return null;
  }
  const {cart, setIsCartOpen} = cartCtx;  

  const loginContext = useContext(loggedInContext); 
  if (!loginContext) {
    return null;
  } 

  const {isLoggedIn, setIsLoggedIn} = loginContext; 

  const handleThumbnailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCartOpen(false)
    setIsPanelOpen(true);
  };

   const handleCartClick = () => {
    setIsCartOpen((pValue: any) => !pValue);
  };

  const handleLoginClick = () => {
      if (justSignedOut) {
        return;
      }
    setOpenModal("sign-in");
  }

 const handleLogoutClick = async () => {
  try{
    await logoutUser(); 
    setIsLoggedIn(false); 
      setJustSignedOut(true);
      if (signedOutTimeoutRef.current) {
        window.clearTimeout(signedOutTimeoutRef.current);
      }
      signedOutTimeoutRef.current = window.setTimeout(() => {
        setJustSignedOut(false);
      }, 1000);
    } catch{
    throw new Error("Unexpected error logging out")
  }
 }

   useEffect(() => {
    return () => {
      if (signedOutTimeoutRef.current) {
        window.clearTimeout(signedOutTimeoutRef.current);
      }
    };
   }, []);

  return (
    <>
    {openModal === "sign-in" || openModal === "sign-up" ? 
  <SignInForm openModal={openModal} setOpenModal={setOpenModal} /> : null
  }
      <OptionsPanel isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <nav className="header__nav_bar">
        <h1 className="header__nav_bar_title">The Collection</h1>
        <div className="header__nav_bar_button_container">
          <button 
          type="button" 
          className={`header__signIn_btn ${justSignedOut ? "header__signIn_btn--signed_out" : ""}`}
          disabled={justSignedOut && !isLoggedIn}
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}>
            {justSignedOut ? "Signed Out" : isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
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
