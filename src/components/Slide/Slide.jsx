import "./Slide.css";
import rightArrow from "../../assets/rightGalloryArrow.png";
import leftArrow from "../../assets/leftGalloryArrow.png";

import slide1 from "../../assets/MainBackgroundImage.jpeg";
import slide2 from "../../assets/twoMen.jpeg";
import slide3 from "../../assets/womanInJacket.jpeg";
import { useState } from "react";

function Slide() {
  const myImages = [slide1, slide2, slide3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState("slide-enter");

  const prevSlide = () => {
    setAnimationState("slide-exit");
    setTimeout(() => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? myImages.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      setAnimationState("slide-enter");
    }, 300); // Duration should match your CSS animation
  };

  const nextSlide = () => {
    setAnimationState("slide-exit");
    setTimeout(() => {
      const isLastSlide = currentIndex === myImages.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
      setAnimationState("slide-enter");
    }, 300);
  };

  return (
    <div className="slide__background_img_container">
      <div className={`slide ${animationState}`}>
        <img
          src={myImages[currentIndex]}
          alt=""
          className="slide__background_img"
        />
      </div>
      <button
        className="slide__background_previous"
        type="button"
        onClick={prevSlide}
      >
        <img
          src={leftArrow}
          alt="Previous Button"
          className="slide__background_next_img"
        />
      </button>
      <button
        className="slide__background_next"
        type="button"
        onClick={nextSlide}
      >
        <img
          src={leftArrow}
          alt="Next Button"
          className="slide__background_next_img slide__background_next_img_type_next"
        />
      </button>
    </div>
  );
}

export default Slide;
