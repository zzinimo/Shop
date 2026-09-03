import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

//css
import "./App.css";

//components
import Header from "../Header/Header.js";
import Main from "../Main/Main.jsx";
import OurStory from "../OurStory/OurStory.jsx";
import Products from "../Products/Products.jsx";
import SubscribeForm from "../SubscribeForm/SubscribeForm.jsx";
import AllProducts from "../AllProducts/AllProducts.js";
import Cart from "../Cart/Cart.jsx";
import Checkout from "../Checkout/Checkout.jsx";

//context
import { cartContext, loggedInContext } from "../../context.js";

//Types

function App() {
  const [shoppingCart, setShoppingCart] = useState(() => {
    let cartData;
    try {
      cartData = localStorage.getItem("cart");
      if (cartData === null) {
        return [];
      } else {
        return JSON.parse(cartData);
      }
    } catch {
      console.error("Failed to parse JSON. Using fallback data istead");
      return [];
    }
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOutsideCartClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false);
    }
  };

  useEffect(() => {
    const saveCartToStorage = () => {
      localStorage.setItem("cart", JSON.stringify(shoppingCart));
    };

    saveCartToStorage();
  }, [shoppingCart]);
  return (
    <>
      <cartContext.Provider
        value={{
          cart: shoppingCart,
          setCart: setShoppingCart,
          isCartOpen,
          setIsCartOpen,
        }}
      >
        <loggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {isCartOpen && (
            <div className="cart__overlay" onClick={handleOutsideCartClick}>
              <div className="cart__panel" onClick={(e) => e.stopPropagation()}>
                <Cart className={isCartOpen ? "open" : ""} />
              </div>
            </div>
          )}
          <Routes>
            <Route
              path="/all-products"
              element={
                <>
                  <Header
                    isPanelOpen={isPanelOpen}
                    setIsPanelOpen={setIsPanelOpen}
                  />
                  <AllProducts />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <Header
                    isPanelOpen={isPanelOpen}
                    setIsPanelOpen={setIsPanelOpen}
                  />
                  <Main />
                  <OurStory />
                  <Products />
                  <SubscribeForm />
                </>
              }
            />

            <Route
              path="/checkout"
              element={
                <>
                  <Header
                    isPanelOpen={isPanelOpen}
                    setIsPanelOpen={setIsPanelOpen}
                  />
                  <Checkout />
                </>
              }
            />
          </Routes>
        </loggedInContext.Provider>
      </cartContext.Provider>
    </>
  );
}

export default App;
