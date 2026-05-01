import "./Header.css";
import sideThumbnail from "../../assets/thumbNailSide.png";
import OptionsPanel from "../OptionsPanel/OptionsPanel";

import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ isPanelOpen, setIsPanelOpen }) {
  const handleThumbnailClick = (e) => {
    setIsPanelOpen(true);
  };

  return (
    <>
      {isPanelOpen && (
        <OptionsPanel
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      )}
      <nav className="header__nav_bar">
        <h1 className="header__nav_bar_title">The Collection</h1>
        <img
          src={sideThumbnail}
          alt="Options Thumbnail"
          className="header__nav_bar_thumbnail"
          onClick={handleThumbnailClick}
        />
      </nav>
    </>
  );
}

export default Header;
