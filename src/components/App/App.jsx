import "./App.css";
import { useState } from "react";

//components
import Header from "../Header/Header";
import Main from "../Main/Main";
import OurStory from "../OurStory/OurStory";
import Products from "../Products/Products";

function App() {
  //handles OptionsPanel visibility. Passed to Header and OptionsPanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <Header isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <Main />
      <OurStory />
      <Products />
    </>
  );
}

export default App;
