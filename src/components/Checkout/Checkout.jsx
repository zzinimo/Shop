import "./Checkout.css";

import { useState } from "react";

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState(true);

  const handleRadioClick = (value) => {
    setShippingAddress(value);
    console.log("shipping address state", value);
  };
  return (
    <>
      <form id="checkout__form">
        <h1 className="checkout__form_title">Personal Information</h1>
        <label htmlFor="fname">
          <input
            type="text"
            id="fname"
            placeholder="Enter First Name"
            className="checkout__form_input"
          />
        </label>
        <label htmlFor="lname">
          <input
            type="text"
            id="lname"
            placeholder="Enter Last Name"
            className="checkout__form_input"
          />
        </label>
        <label htmlFor="email">
          <input
            type="text"
            id="email"
            placeholder="Enter Email"
            className="checkout__form_input"
          />
        </label>
        <label htmlFor="address">
          <input
            type="text"
            id="address"
            placeholder="Enter Address"
            className="checkout__form_input"
          />
        </label>
        <p className="checkout__form_billing_text">
          Is your shipping address the same as your billing address?
        </p>

        <div>
          <input
            type="radio"
            id="yes"
            name="billing-address"
            value="yes"
            className="checkout__form_radio_btn"
            onClick={() => handleRadioClick(true)}
          />
          <label htmlFor="yes" className="checkout__form_radio_btn_label">
            Yes
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="no"
            name="billing-address"
            value="no"
            className="checkout__form_radio_btn"
            onClick={() => handleRadioClick(false)}
          />
          <label htmlFor="no" className="checkout__form_radio_btn_label">
            No
          </label>
        </div>

        {shippingAddress === false ? (
          <label htmlFor="">
            <input
              type="text"
              placeholder="Enter Shipping Address"
              className="checkout__form_input"
            />
          </label>
        ) : null}
      </form>

      <form id="payment__Form">
        <h1 className="payment__form_title">Payment Form</h1>
        <label htmlFor="cardName">
          <input
            type="text"
            id="cardName"
            placeholder="Name on Card"
            className="payment__form_input"
            required
            name="cardName"
          />
        </label>
        <label htmlFor="cardNumber">
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="Card Number"
            name="cardNumber"
            required
            className="payment__form_input"
          />
        </label>

        <label htmlFor="cardExperation">
          <input
            type="text"
            id="cardExperation"
            name="cardExperation"
            placeholder="MM / YY"
            inputMode="numeric"
            maxLength={7}
            required
            className="payment__form_input"
          />
        </label>
        <label htmlFor="card-cvc">
          <input
            type="text"
            id="card-cvc"
            name="cvc"
            inputMode="numeric"
            required
            maxLength={3}
            placeholder="CVC"
            className="payment__form_input payment__form_input_type_cvc"
          />
        </label>

        <label htmlFor="billing-zip">
          <input
            type="text"
            id="billing-zip"
            required
            maxLength={5}
            placeholder="Billing Zip Code"
            className="payment__form_input"
          />
        </label>
      </form>
    </>
  );
}

export default Checkout;
