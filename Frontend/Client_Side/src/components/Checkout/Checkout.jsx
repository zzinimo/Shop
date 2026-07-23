import "./Checkout.css";
import { useState, useEffect, useContext } from "react";
import { cartContext } from "../../context.js";
import { createOrder } from "../../api.jsx";

function Checkout() {
  const context = useContext(cartContext);
  if (!context) {
    return null;
  }

  const { cart } = context;

  const [shippingAddress, setShippingAddress] = useState(true);
  const [userInput, setUserInput] = useState({
    customer: {
      firstName: "",
      lastName: "",
      email: "",
    },
    shippingAddress: {
      address: "",
    },
    items: [],
  });

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset.section;

    setUserInput((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleRadioClick = (value) => {
    setShippingAddress(value);
    console.log("shipping address state", value);
  };

  const handleSubmitOrder = async () => {
    const itemsToOrder = cart.map((cartItem) => ({
      quantity: Number(cartItem.quantity ?? 1),
      price: Number(
        String(cartItem.price).replace("$", "").replaceAll(",", ""),
      ),
      productId: cartItem._id,
      src: cartItem.src,
      description: cartItem.description,
    }));

    try {
      await createOrder({
        customer: userInput.customer,
        shippingAddress: userInput.shippingAddress,
        items: itemsToOrder,
      });
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  //used for console.log statement when testing handleInputChange function line 25;
  // useEffect(() => {}, [userInput]);

  //may need to add more datasets
  return (
    <>
      <form id="checkout__form">
        <h1 className="checkout__form_title">Personal Information</h1>
        <label htmlFor="firstName">
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter First Name"
            className="checkout__form_input"
            data-section="customer"
            onChange={handleInputChange}
          />
        </label>
        <label htmlFor="lastName">
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter Last Name"
            className="checkout__form_input"
            data-section="customer"
            onChange={handleInputChange}
          />
        </label>
        <label htmlFor="email">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter Email"
            className="checkout__form_input"
            data-section="customer"
            onChange={handleInputChange}
          />
        </label>
        <label htmlFor="address">
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter Address"
            className="checkout__form_input"
            data-section="shippingAddress"
            onChange={handleInputChange}
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
            name="cardName"
            placeholder="Name on Card"
            className="payment__form_input"
            required
          />
        </label>
        <label htmlFor="cardNumber">
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="Card Number"
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
            name="card-cvc"
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
            name="billing-zip"
            required
            maxLength={5}
            placeholder="Billing Zip Code"
            className="payment__form_input"
          />
        </label>
      </form>
      <button
        type="button"
        onClick={handleSubmitOrder}
        className="checkoutForm__submit_btn"
      >
        Submit Order
      </button>
    </>
  );
}

export default Checkout;
