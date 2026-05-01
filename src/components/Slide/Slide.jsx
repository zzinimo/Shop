import "./Slide.css";

import slide1 from "../../assets/MainBackgroundImage.jpeg";
import slide2 from "../../assets/twoMen.jpeg";
import slide3 from "../../assets/womanInJacket.jpeg";
import { useState } from "react";

function Slide() {
  const myImages = [slide1, slide2, slide3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? myImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === myImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  return (
    <div className="slide__background_img_container">
      <img
        src={myImages[currentIndex]}
        alt=""
        className="slide__background_img"
      />
      <button type="button" onClick={prevSlide}>
        previous
      </button>
      <button type="button" onClick={nextSlide}>
        next
      </button>
    </div>
  );
}

export default Slide;
