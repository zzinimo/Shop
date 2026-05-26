import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

//components
import Header from "../Header/Header.js";
import Main from "../Main/Main.jsx";
import OurStory from "../OurStory/OurStory.jsx";
import Products from "../Products/Products.jsx";
import SubscribeForm from "../SubscribeForm/SubscribeForm.jsx";
import AllProducts from "../AllProducts/AllProducts.js";

//context
import { cartContext } from "../../context.js";

//Types

function App() {
  //state
  const [shoppingCart, setShoppingCart] = useState([]);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <cartContext.Provider
        value={{ cart: shoppingCart, setCart: setShoppingCart }}
      >
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
        </Routes>
      </cartContext.Provider>
    </>
  );
}

export default App;
