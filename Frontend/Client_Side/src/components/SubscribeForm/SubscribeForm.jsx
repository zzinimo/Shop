import "./SubscribeForm.css";
import { useState } from "react";
import { subScribeEmail } from "../../api.jsx";

function SubscribeForm() {
  const [input, setInput] = useState({
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    return setInput((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subScribeEmail(input.email);
      setInput({ email: "" });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
      setInput({ email: "" });
    }
  };
  return (
    <>
      <h3 className="subscribe__form_heading">Subscribe</h3>
      <form className="subscribe__form" onSubmit={handleSubmit}>
        <label className="subscribe__form_label" htmlFor="email">
          Please enter your Email Address
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={input?.email}
          className={`subscribe__form_input ${errorMessage ? "subscribe__form_input--error" : ""}`}
          placeholder={errorMessage ? errorMessage : "Email Address"}
          onChange={handleInputChange}
        />
        <button
          className={`subscribe__form_submit-btn ${input.email === "" ? "subscribe__form_submit-btn--error" : ""}`}
          type="submit"
          disabled={input.email === "" && true}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default SubscribeForm;
