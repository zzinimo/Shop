import "./App.css";
import { useState } from "react";

//components
import Header from "../Header/Header";
import Main from "../Main/Main";
import OurStory from "../OurStory/OurStory";

function App() {
  //handles OptionsPanel visibility. Passed to Header and OptionsPanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <Header isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <Main />
      <OurStory />
    </>
  );
}

export default App;
