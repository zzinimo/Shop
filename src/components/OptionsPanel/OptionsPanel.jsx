import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./OptionsPanel.css";
import rightArrow from "../../assets/arrowRight.png";
import closeButton from "../../assets/closeButton (2).png";

function OptionsPanel({ isPanelOpen, setIsPanelOpen }) {
  const [animationState, setAnimationState] = useState(open);
  const customeClassName = ({ isActive }) => {
    return isActive
      ? "container__link container__link_active"
      : "container__link";
  };

  const handleCloseButtonClick = () => {
    setIsPanelOpen(false);
  };
  return (
    <>
      <div
        className={`options-panel ${isPanelOpen ? "options_panel__open" : "options_panel__close"}`}
      >
        <div className="container">
          <button className="container__close_button" type="button">
            <img
              src={closeButton}
              alt="Close Button"
              className="container__close_button_img"
              onClick={handleCloseButtonClick}
            />
          </button>
          <h2 className="optionsPanel__title">The Collection</h2>
          <div className="container__links">
            <div className="container__links_container">
              <NavLink to="/" className={customeClassName}>
                Home
              </NavLink>
              <img
                className="container__link_forward_arrow"
                src={rightArrow}
                alt="Forward Arrow"
              />
            </div>
            <div className="container__links_container">
              <NavLink to="/prducts" className={customeClassName}>
                Products
              </NavLink>
              <img
                className="container__link_forward_arrow"
                src={rightArrow}
                alt="Forward Arrow"
              />
            </div>
            <div className="container__links_container">
              <NavLink to="/cart" className={customeClassName}>
                Cart
              </NavLink>
              <img
                className="container__link_forward_arrow"
                src={rightArrow}
                alt="Forward Arrow"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OptionsPanel;
