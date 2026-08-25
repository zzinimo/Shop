import "./Checkout.css";
import { useContext, useEffect, useRef, useState } from "react";
import { cartContext } from "../../context.js";
import { createOrder } from "../../api.jsx";

function Checkout() {
  const context = useContext(cartContext);
  const { cart = [] } = context || {};
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitTimeoutRef = useRef(null);

  const [shippingAddress, setShippingAddress] = useState(true);

  //PERSONAL INFORMATION INPUT STATE

  const [userInput, setUserInput] = useState({
    customer: {
      firstName: "",
      lastName: "",
      email: "",
    },
    shippingAddress: {
      address: "",
    },
    payment: {
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      securityCode: "",
    },
    items: [],
  });

  // PERSONAL INFORMATION INITIAL OBJECT USED TO CLEAR INPUTS

  const initialPersonalInformationInput = {
    customer: {
      firstName: "",
      lastName: "",
      email: "",
    },
    shippingAddress: {
      address: "",
    },
    payment: {
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      securityCode: "",
    },
    items: [],
  };

  // PERSONAL INFORMATION ONCHANGE HANDLER

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset.section;
    let nextValue = value;

    if (section === "payment" && name === "expirationDate") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    if (section === "payment" && name === "securityCode") {
      nextValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setUserInput((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: nextValue,
      },
    }));
  };

  // PAYMENT FORM RADIO CLICK HANDLER

  const handleRadioClick = (value) => {
    setShippingAddress(value);
    console.log("shipping address state", value);
  };

  // SUBMIT FORM HANDLER THAT CREATES ORDER AND CLEARS INPUTS

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!userInput.customer.email || !userInput.shippingAddress.address) {
      setSubmitError(
        "Please complete email and shipping address before submitting.",
      );
      return;
    }

    if (cart.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitError("");

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
        guestEmail: userInput.customer.email,
        shippingAddress: userInput.shippingAddress,
        items: itemsToOrder,
      });
      setUserInput(initialPersonalInformationInput);
      setOrderSubmitted(true);
      if (submitTimeoutRef.current) {
        window.clearTimeout(submitTimeoutRef.current);
      }
      submitTimeoutRef.current = window.setTimeout(() => {
        setOrderSubmitted(false);
      }, 1000);
    } catch (err) {
      setOrderSubmitted(false);
      setSubmitError(err.message || "Could not submit order.");
      console.error("Error creating order:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  //used for console.log statement when testing handleInputChange function line 25;
  // useEffect(() => {}, [userInput]);

  return (
    <>
      <form id="checkout__form" onSubmit={handleSubmitOrder}>
        <h1 className="checkout__form_title">Personal Information</h1>
        <label htmlFor="firstName">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={userInput.customer.firstName ?? ""}
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
            value={userInput.customer.lastName ?? ""}
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
            value={userInput.customer.email ?? ""}
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
            value={userInput.shippingAddress.address ?? ""}
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

        <section id="payment__Form">
          <h2 className="payment__form_title">Payment Information</h2>
          <label htmlFor="nameOnCard">
            <input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              value={userInput.payment.nameOnCard ?? ""}
              placeholder="Name on Card"
              className="payment__form_input"
              data-section="payment"
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="cardNumber">
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={userInput.payment.cardNumber ?? ""}
              placeholder="Card Number"
              className="payment__form_input"
              data-section="payment"
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="expirationDate">
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={userInput.payment.expirationDate ?? ""}
              placeholder="MMYY"
              className="payment__form_input"
              data-section="payment"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="securityCode">
            <input
              type="text"
              id="securityCode"
              name="securityCode"
              value={userInput.payment.securityCode ?? ""}
              placeholder="CVV"
              className="payment__form_input"
              data-section="payment"
              inputMode="numeric"
              pattern="[0-9]{3}"
              maxLength={3}
              onChange={handleInputChange}
            />
          </label>
        </section>
        <button
          type="submit"
          className={`checkoutForm__submit_btn ${orderSubmitted ? "checkoutForm__submit_btn--submitted" : ""}`}
        >
          {orderSubmitted ? "Order Submitted" : "Submit Order"}
        </button>
        {submitError ? (
          <p className="checkoutForm__error_message">{submitError}</p>
        ) : null}
      </form>
    </>
  );
}

export default Checkout;
