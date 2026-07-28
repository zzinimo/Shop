import "./SignInForm.css";
import { useEffect, useState } from "react";
import { createUser } from "../../api.jsx";

const SignInForm = ({ setOpenModal, openModal }) => {
  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
  });

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
    await createUser(userInput);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setOpenModal("sign-up");
  };

  useEffect(() => {
    const handleEscapeKeyClick = (e) => {
      if (e.key === "Escape") {
        setOpenModal(null);
      }
    };

    window.addEventListener("keydown", handleEscapeKeyClick);
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
            close
          </button>
          <h1 className="customerForm__title">Sign In</h1>
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
            {openModal === "sign-up" && (
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
            Sign Up
          </button>
          {openModal === "sign-in" && (
            <p className="customerForm__signIn_text">
              Don't have an account?
              <button type="button" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignInForm;
