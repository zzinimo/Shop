import "./App.css";
import { useState } from "react";

//components
import Header from "../Header/Header";
import Main from "../Main/Main";

function App() {
  //handles OptionsPanel visibility. Passed to Header and OptionsPanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <Header isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <Main />
    </>
  );
}

export default App;
