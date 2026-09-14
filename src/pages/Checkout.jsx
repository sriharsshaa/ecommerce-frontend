import { useState } from "react";

function Checkout({ cart, onPlaceOrder }) {

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
  }

  function validateForm() {

    // -------------------------
    // DELIVERY VALIDATION
    // -------------------------

    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.address.trim()) {
      return "Please enter your address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }


    // -------------------------
    // UPI VALIDATION
    // -------------------------

    if (paymentMethod === "UPI") {

      if (!formData.upiId.trim()) {
        return "Please enter your UPI ID.";
      }

      if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
        return "Please enter a valid UPI ID.";
      }
    }


    // -------------------------
    // CARD VALIDATION
    // -------------------------

    if (paymentMethod === "Card") {

      if (!/^\d{16}$/.test(formData.cardNumber)) {
        return "Please enter a valid 16-digit card number.";
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        return "Please enter a valid expiry date in MM/YY format.";
      }

      if (!/^\d{3}$/.test(formData.cvv)) {
        return "Please enter a valid 3-digit CVV.";
      }
    }

    return "";
  }


  function handleSubmit(event) {

    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Validation successful
    onPlaceOrder(paymentMethod);
  }


  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="checkout-left">

          <h1>Checkout</h1>


          {/* DELIVERY ADDRESS */}

          <div className="checkout-card">

            <h2>Delivery Address</h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              maxLength="6"
              value={formData.pincode}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>


          {/* PAYMENT METHOD */}

          <div className="checkout-card">

            <h2>Payment Method</h2>


            {/* CASH ON DELIVERY */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={
                  paymentMethod === "Cash on Delivery"
                }
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                  setError("");
                }}
              />

              <span>💵 Cash on Delivery</span>

            </label>


            {/* UPI */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                  setError("");
                }}
              />

              <span>📱 UPI</span>

            </label>


            {paymentMethod === "UPI" && (

              <div className="payment-details">

                <input
                  type="text"
                  name="upiId"
                  placeholder="Enter UPI ID"
                  value={formData.upiId}
                  onChange={handleChange}
                />

              </div>

            )}


            {/* CARD */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                  setError("");
                }}
              />

              <span>💳 Credit / Debit Card</span>

            </label>


            {paymentMethod === "Card" && (

              <div className="payment-details">

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  maxLength="16"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="expiry"
                  placeholder="Expiry (MM/YY)"
                  maxLength="5"
                  value={formData.expiry}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="3"
                  value={formData.cvv}
                  onChange={handleChange}
                />

              </div>

            )}

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="checkout-error">
              {error}
            </div>

          )}

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="checkout-right">

          <div className="checkout-card">

            <h2>Order Summary</h2>


            {cart.map((product) => (

              <div
                className="checkout-product"
                key={product.id}
              >

                <div>

                  <strong>
                    {product.name}
                  </strong>

                  <p>
                    Quantity: {product.quantity}
                  </p>

                </div>

                <span>
                  ₹{(
                    product.price *
                    product.quantity
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            ))}


            <hr />


            <div className="checkout-total">

              <strong>Total</strong>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>

            </div>


            <button
              className="place-order-button"
              onClick={handleSubmit}
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
