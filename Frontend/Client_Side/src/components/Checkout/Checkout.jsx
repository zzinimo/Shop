import "./Checkout.css";
import { useState, useContext } from "react";
import { cartContext } from "../../context.js";
import { createOrder } from "../../api.jsx";

function Checkout() {
  const context = useContext(cartContext);
  const { cart = [] } = context || {};

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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

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
        <button type="submit" className="checkoutForm__submit_btn">
          Submit Order
        </button>
      </form>
    </>
  );
}

export default Checkout;
