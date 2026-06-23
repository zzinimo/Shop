import { useEffect } from "react";
import "./Modal.css";

import closeButton from "../../assets/closeButton (2).png";

function Modal({
  selectedImage,
  selectedDescription,
  selectedPrice,
  setIsOpen,
  isOpen,
}) {
  useEffect(() => {
    const handleEscapeKeyClick = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKeyClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyClick);
    };
  });

  const handleCloseButtonClick = () => {
    setIsOpen(false);
  };

  const handleModalWindowClick = (e) => {
    if (e.target.className === "modal") {
      setIsOpen(false);
    }
  };

  return (
    <div className="modal" onClick={handleModalWindowClick}>
      <div className="modal__container">
        <button className="modal__container_close_button">
          <img
            src={closeButton}
            alt="Close Button"
            className="close__button_img"
            onClick={handleCloseButtonClick}
          />
        </button>
        <div className="madal__container_image">
          <img
            src={selectedImage ?? ""}
            alt="Product Photo"
            className="modal__image"
          />
          <div className="modal__container_text">
            <p className="modal__description">{selectedDescription ?? ""}</p>
            <p className="modal__description">{selectedPrice ?? ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
