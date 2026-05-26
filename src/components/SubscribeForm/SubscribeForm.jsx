import "./SubscribeForm.css";

function SubscribeForm() {
  return (
    <>
      <h3 className="subscribe__form_heading">Subscribe</h3>
      <form className="subscribe__form">
        <label className="subscribe__form_label" htmlFor="email">
          Please enter your Email Address
        </label>
        <input
          type="text"
          id="email"
          className="subscribe__form_input"
          placeholder="Email Address"
        />
      </form>
    </>
  );
}

export default SubscribeForm;
