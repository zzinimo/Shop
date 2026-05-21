import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

//components
import Header from "../Header/Header.js";
import Main from "../Main/Main.js";
import OurStory from "../OurStory/OurStory.js";
import Products from "../Products/Products.js";
import SubscribeForm from "../SubscribeForm/SubscribeForm.js";
import AllProducts from "../AllProducts/AllProducts.js";

function App() {
  //handles OptionsPanel visibility. Passed to Header and OptionsPanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <Routes>
        <Route path="/all-products" element={<AllProducts />} />
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
    </>
  );
}

export default App;
