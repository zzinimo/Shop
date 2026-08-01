import "./SignInForm.css";
import { useEffect, useState, useContext } from "react";
import { createUser, loginUser } from "../../api.jsx";
import { loggedInContext } from "../../context.js";
import closeButton from "../../assets/closeButton (2).png";

const SignInForm = ({ setOpenModal, openModal }) => {
  const loginContext = useContext(loggedInContext);
  if (!loginContext) {
    return null;
  }
  const { isLoggedIn, setIsLoggedIn } = loginContext;

  const isSignUpMode = openModal === "sign-up";

  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
  });

  const initialUserInput = {
    email: "",
    username: "",
    password: "",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    return setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseButtonClick = () => {
    setOpenModal(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpenModal(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSignUpMode) {
      await createUser(userInput);
      setUserInput(initialUserInput);
      setOpenModal("sign-in");
    } else {
      await loginUser({
        email: userInput.email,
        password: userInput.password,
      });
      setUserInput(initialUserInput);
      setIsLoggedIn(true);
      setOpenModal(null);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setOpenModal("sign-up");
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setOpenModal("sign-in");
  };

  useEffect(() => {
    const handleEscapeKeyClick = (e) => {
      if (e.key === "Escape") {
        setOpenModal(null);
      }
    };

    window.addEventListener("keydown", handleEscapeKeyClick);

    return () => {
      window.removeEventListener("keydown", handleEscapeKeyClick);
    };
  }, [setOpenModal]);
  return (
    <>
      <div className="customer__form_modal" onClick={handleModalClick}>
        <form onSubmit={handleFormSubmit} id="customerForm">
          <button
            onClick={handleCloseButtonClick}
            type="button"
            className="customerForm__close_btn"
          >
            <img
              className="customerForm_close_btn_img"
              src={closeButton}
              alt=""
            />
          </button>
          <h1 className="customerForm__title">
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </h1>
          <div className="customerForm__content">
            <label className="customerForm__label" htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="customerForm__input"
                value={userInput.email}
                onChange={handleInputChange}
              />
            </label>
            {isSignUpMode && (
              <label className="customerForm__label" htmlFor="username">
                Username
                <input
                  type="username"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="customerForm__input"
                  value={userInput.username}
                  onChange={handleInputChange}
                />
              </label>
            )}
            <label className="customerForm__label" htmlFor="password">
              Password
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter desired password"
                className="customerForm__input"
                value={userInput.password}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button type="submit" className="customerForm__submit_btn">
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </button>
          {!isSignUpMode && (
            <p className="customerForm__signIn_text">
              Don't have an account?
              <button
                className="customerForm__signup_btn"
                type="button"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </p>
          )}
          {isSignUpMode && (
            <p className="customerForm__signIn_text">
              Already have an account?
              <button
                className="customerForm__signIn_btn"
                type="button"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignInForm;
