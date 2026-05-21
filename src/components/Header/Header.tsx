import "./Header.css";
import sideThumbnail from "../../assets/menu.png";
import OptionsPanel from "../OptionsPanel/OptionsPanel.js";

type HeaderProps = {
  isPanelOpen: boolean, 
  setIsPanelOpen: (value:boolean) => void; 
}

function Header({ isPanelOpen, setIsPanelOpen }: HeaderProps) {
  const handleThumbnailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPanelOpen(true);
    console.log("function ran");
  };

  return (
    <>
      <OptionsPanel isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      <nav className="header__nav_bar">
        <h1 className="header__nav_bar_title">The Collection</h1>
        <button
          className="header__nav_bar_button"
          type="button"
          onClick={handleThumbnailClick}
        >
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
