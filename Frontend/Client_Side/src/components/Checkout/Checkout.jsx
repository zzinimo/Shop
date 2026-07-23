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
    items: [],
  };

  // PAYMENT FORM INPUT STATE

  const [paymentInput, setPaymentInput] = useState({
    cardName: "",
    cardNumber: "",
    cardExperation: "",
    card_cvc: "",
    billing_zip: "",
  });

  //PAYMENT INFORMATION ITITIAL OBJECT USED TO CLEAR STATE

  const initialPaymentInformationInput = {
    cardName: "",
    cardNumber: "",
    cardExperation: "",
    card_cvc: "",
    billing_zip: "",
  };

  // PAYMENT FORM ONCHANGE HANDLER

  const hanglePaymentFormInputChange = (e) => {
    const { name, value } = e.target;

    setPaymentInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // PERSONAL INFORMATION ONCHANGE HANDLER

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

  // PAYMENT FORM RADIO CLICK HANDLER

  const handleRadioClick = (value) => {
    setShippingAddress(value);
    console.log("shipping address state", value);
  };

  // SUBMIT FORM HANDLER THAT CREATES ORDER AND CLEARS INPUTS

  const handleSubmitOrder = async () => {
    console.log("order submitted");
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
      setUserInput(initialPersonalInformationInput);
      setPaymentInput(initialPaymentInformationInput);
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  //used for console.log statement when testing handleInputChange function line 25;
  // useEffect(() => {}, [userInput]);

  return (
    <>
      <form id="checkout__form">
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
      </form>
      {/* ------------------------------------------------------------------------------------------------------------------------- */}
      <form id="payment__Form">
        <h1 className="payment__form_title">Payment Form</h1>
        <label htmlFor="cardName">
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={paymentInput.cardName ?? ""}
            placeholder="Name on Card"
            className="payment__form_input"
            required
            onChange={hanglePaymentFormInputChange}
          />
        </label>
        <label htmlFor="cardNumber">
          <input
            id="cardNumber"
            name="cardNumber"
            value={paymentInput.cardNumber ?? ""}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="Card Number"
            required
            className="payment__form_input"
            onChange={hanglePaymentFormInputChange}
          />
        </label>

        <label htmlFor="cardExperation">
          <input
            type="text"
            id="cardExperation"
            name="cardExperation"
            value={paymentInput.cardExperation ?? ""}
            placeholder="MM / YY"
            inputMode="numeric"
            maxLength={7}
            required
            className="payment__form_input"
            onChange={hanglePaymentFormInputChange}
          />
        </label>
        <label htmlFor="card_cvc">
          <input
            type="text"
            id="card_cvc"
            name="card_cvc"
            value={paymentInput.card_cvc ?? ""}
            inputMode="numeric"
            required
            maxLength={3}
            placeholder="CVC"
            className="payment__form_input payment__form_input_type_cvc"
            onChange={hanglePaymentFormInputChange}
          />
        </label>

        <label htmlFor="billing_zip">
          <input
            type="text"
            id="billing_zip"
            name="billing_zip"
            value={paymentInput.billing_zip ?? ""}
            required
            maxLength={5}
            placeholder="Billing Zip Code"
            className="payment__form_input"
            onChange={hanglePaymentFormInputChange}
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
