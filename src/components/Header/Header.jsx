import "./Header.css";
import sideThumbnail from "../../assets/thumbNailSide.png";
import OptionsPanel from "../OptionsPanel/OptionsPanel";

import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ isPanelOpen, setIsPanelOpen }) {
  const handleThumbnailClick = (e) => {
    e.preventDefault();
    setIsPanelOpen(true);
    console.log("function ran");
  };

  return (
    <>
      <OptionsPanel isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <nav className="header__nav_bar">
        <h1 className="header__nav_bar_title">The Collection</h1>
        <button type="button" onClick={handleThumbnailClick}>
          <img
            src={sideThumbnail}
            alt="Options Thumbnail"
            className="header__nav_bar_thumbnail"
          />
        </button>
      </nav>
    </>
  );
}

export default Header;
