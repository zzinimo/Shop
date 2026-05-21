import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

//components
import Header from "../Header/Header";
import Main from "../Main/Main";
import OurStory from "../OurStory/OurStory";
import Products from "../Products/Products";
import SubscribeForm from "../SubscribeForm/SubscribeForm";
import AllProducts from "../AllProducts/AllProducts";

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
