import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, onPlaceOrder }) {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const [formData, setFormData] = useState({
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");

  // =========================================================
  // BILL CALCULATION
  // =========================================================

  const itemCount = cart.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  const deliveryFee = 0;

  const discount = 0;

  const total = subtotal + deliveryFee - discount;

  // =========================================================
  // LOAD SAVED ADDRESSES
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchAddresses() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load addresses");
        }

        const data = await response.json();

        setAddresses(data);

        // Select default address first
        const defaultAddress = data.find(
          (address) => address.isDefault
        );

        if (defaultAddress) {
          setSelectedAddressId(
            String(defaultAddress.id)
          );
        } else if (data.length > 0) {
          setSelectedAddressId(
            String(data[0].id)
          );
        }
      } catch (error) {
        console.error(
          "Error loading addresses:",
          error
        );

        setError(
          "Failed to load saved addresses."
        );
      } finally {
        setLoadingAddresses(false);
      }
    }

    fetchAddresses();
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  function validateForm() {
    // -------------------------
    // ADDRESS VALIDATION
    // -------------------------

    if (!selectedAddressId) {
      return "Please select a delivery address.";
    }

    // -------------------------
    // UPI VALIDATION
    // -------------------------

    if (paymentMethod === "UPI") {
      if (!formData.upiId.trim()) {
        return "Please enter your UPI ID.";
      }

      if (
        !/^[\w.-]+@[\w.-]+$/.test(
          formData.upiId
        )
      ) {
        return "Please enter a valid UPI ID.";
      }
    }

    // -------------------------
    // CARD VALIDATION
    // -------------------------

    if (paymentMethod === "Card") {
      if (
        !/^\d{16}$/.test(
          formData.cardNumber
        )
      ) {
        return "Please enter a valid 16-digit card number.";
      }

      if (
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
          formData.expiry
        )
      ) {
        return "Please enter a valid expiry date in MM/YY format.";
      }

      if (
        !/^\d{3}$/.test(
          formData.cvv
        )
      ) {
        return "Please enter a valid 3-digit CVV.";
      }
    }

    return "";
  }

  // =========================================================
  // PLACE ORDER
  // =========================================================

  function handleSubmit(event) {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Send payment method + selected address
    onPlaceOrder(
      paymentMethod,
      Number(selectedAddressId)
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="checkout-left">

          <h1>Checkout</h1>

          {/* =================================================
              DELIVERY ADDRESS
          ================================================= */}

          <div className="checkout-card">

            <div className="checkout-section-header">

              <div>
                <p className="checkout-section-label">
                  DELIVERY
                </p>

                <h2>
                  Delivery Address
                </h2>
              </div>

              <button
                type="button"
                className="manage-addresses-button"
                onClick={() =>
                  navigate("/addresses")
                }
              >
                Manage Addresses
              </button>

            </div>

            {loadingAddresses ? (

              <p className="checkout-loading">
                Loading saved addresses...
              </p>

            ) : addresses.length === 0 ? (

              <div className="no-checkout-address">

                <div className="no-checkout-address-icon">
                  📍
                </div>

                <h3>
                  No saved address
                </h3>

                <p>
                  Please add a delivery address
                  before placing your order.
                </p>

                <button
                  type="button"
                  className="add-checkout-address-button"
                  onClick={() =>
                    navigate("/addresses")
                  }
                >
                  + Add Address
                </button>

              </div>

            ) : (

              <div className="checkout-address-list">

                {addresses.map((address) => (

                  <label
                    className={`checkout-address-option ${
                      String(address.id) ===
                      String(selectedAddressId)
                        ? "selected-address"
                        : ""
                    }`}
                    key={address.id}
                  >

                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address.id}
                      checked={
                        String(address.id) ===
                        String(selectedAddressId)
                      }
                      onChange={(event) =>
                        setSelectedAddressId(
                          event.target.value
                        )
                      }
                    />

                    <div className="checkout-address-content">

                      <div className="checkout-address-top">

                        <strong>
                          {address.fullName}
                        </strong>

                        {address.isDefault && (
                          <span className="checkout-default-badge">
                            Default
                          </span>
                        )}

                      </div>

                      <p>
                        {address.addressLine}
                      </p>

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                      <p>
                        Phone: {address.phone}
                      </p>

                    </div>

                  </label>

                ))}

              </div>

            )}

          </div>

          {/* =================================================
              PAYMENT METHOD
          ================================================= */}

          <div className="checkout-card">

            <div className="checkout-section-header">

              <div>
                <p className="checkout-section-label">
                  PAYMENT
                </p>

                <h2>
                  Payment Method
                </h2>
              </div>

            </div>

            {/* CASH ON DELIVERY */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={
                  paymentMethod ===
                  "Cash on Delivery"
                }
                onChange={(event) => {
                  setPaymentMethod(
                    event.target.value
                  );

                  setError("");
                }}
              />

              <span>
                💵 Cash on Delivery
              </span>

            </label>

            {/* UPI */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={
                  paymentMethod === "UPI"
                }
                onChange={(event) => {
                  setPaymentMethod(
                    event.target.value
                  );

                  setError("");
                }}
              />

              <span>
                📱 UPI
              </span>

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
                checked={
                  paymentMethod === "Card"
                }
                onChange={(event) => {
                  setPaymentMethod(
                    event.target.value
                  );

                  setError("");
                }}
              />

              <span>
                💳 Credit / Debit Card
              </span>

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

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

        </div>

        {/* =================================================
            RIGHT SIDE - BILL SUMMARY
        ================================================= */}

        <div className="checkout-right">

          <div className="checkout-card bill-summary-card">

            <p className="checkout-section-label">
              ORDER DETAILS
            </p>

            <h2>
              Bill Summary
            </h2>

            {/* PRODUCT LIST */}

            <div className="checkout-products">

              {cart.map((product) => (

                <div
                  className="checkout-product"
                  key={product.id}
                >

                  <div className="checkout-product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <p>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                      {" "}×{" "}
                      {product.quantity}
                    </p>

                  </div>

                  <span>
                    ₹
                    {(
                      product.price *
                      product.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              ))}

            </div>

            <hr />

            {/* BILL BREAKDOWN */}

            <div className="bill-row">

              <span>
                Items ({itemCount})
              </span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="bill-row">

              <span>
                Delivery Fee
              </span>

              <span className="free-delivery">
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee.toLocaleString(
                      "en-IN"
                    )}`}
              </span>

            </div>

            <div className="bill-row">

              <span>
                Discount
              </span>

              <span className="discount-amount">
                {discount > 0
                  ? `- ₹${discount.toLocaleString(
                      "en-IN"
                    )}`
                  : "₹0"}
              </span>

            </div>

            <hr />

            {/* GRAND TOTAL */}

            <div className="checkout-total">

              <div>
                <strong>
                  Grand Total
                </strong>

                <small>
                  Inclusive of all applicable charges
                </small>
              </div>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* SAVINGS */}

            {discount > 0 && (
              <div className="checkout-savings">
                You save ₹
                {discount.toLocaleString(
                  "en-IN"
                )} on this order
              </div>
            )}

            {/* PLACE ORDER */}

            <button
              className="place-order-button"
              onClick={handleSubmit}
              disabled={
                loadingAddresses ||
                addresses.length === 0 ||
                cart.length === 0
              }
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