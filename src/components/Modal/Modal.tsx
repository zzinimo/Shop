import {  useEffect } from "react";
import "./Modal.css";

import closeButton from "../../assets/closeButton (2).png";

type ModalProps = {
  selectedImage: string | null, 
  isOpen: boolean, 
  setIsOpen: (value: boolean) => void

}

function Modal({ selectedImage, setIsOpen }: ModalProps) {
  useEffect(() => {
    const handleEscapeKeyClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKeyClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyClick);
    };
  });

  const handleCloseButtonClick = (e) => {
    setIsOpen(false);
  };

  const handleModalWindowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e);
    if ((e.target as HTMLElement).className === "modal") {
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
            src={selectedImage}
            alt="Product Photo"
            className="modal__image"
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
