import { useNavigate } from "react-router-dom";
function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {

  const navigate = useNavigate();
  // Calculate total price
  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  return (
    <div className="cart-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header">
        <p className="page-label">
          YOUR SHOPPING CART
        </p>
        <h1>
          Shopping Cart
        </h1>
        <p>
          Review your products before placing your order.
        </p>
      </div>

      {/* =====================================================
          EMPTY CART
      ===================================================== */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products to your cart and
            they will appear here.
          </p>

        </div>


      ) : (


        /* =====================================================
           CART CONTENT
        ===================================================== */

        <div className="cart-layout">


          {/* =================================================
              CART PRODUCTS
          ================================================= */}

          <div className="cart-products">

            {cart.map((product) => (

              <div
                key={product.id}
                className="cart-product"
              >


{/* PRODUCT IMAGE */}

<div className="cart-product-image">

  <img
    src={
      {
        1: "/images/iphone15.png",
        2: "/images/dell-laptop.png",
        3: "/images/sony_headphones.png",
        4: "/images/samsung_galaxy_s24.png",
        5: "/images/hp_pavilion.png",
        6: "/images/jbl_bluetooth_speaker.png",
        7: "/images/apple_watch_series_9.png",
        8: "/images/logitech_mouse.png",
        9: "/images/samsung_27inch_monitor.png",
      }[product.id]
    }
    alt={product.name}
  />

</div>


                {/* PRODUCT DETAILS */}

                <div className="cart-product-details">

                  <span className="cart-category">
                    {product.category}
                  </span>

                  <h2>
                    {product.name}
                  </h2>

                  <p className="cart-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-section">

                    <span>
                      Quantity
                    </span>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(product.id)
                        }
                      >
                        −
                      </button>


                      <span>
                        {product.quantity}
                      </span>


                      <button
                        onClick={() =>
                          increaseQuantity(product.id)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>


                {/* PRODUCT SUBTOTAL */}

                <div className="cart-product-total">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {(
                      product.price *
                      product.quantity
                    ).toLocaleString("en-IN")}
                  </strong>


                  {/* REMOVE */}

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(product.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            {/* ITEMS */}

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {cart.length}
              </span>

            </div>


            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>

            </div>


            {/* DELIVERY */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free">
                FREE
              </span>

            </div>


            <hr />


            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>

            </div>


            {/* =================================================
                PROCEED TO CHECKOUT
            ================================================= */}

            <button
              className="proceed-checkout-button"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout →
            </button>

          </div>


        </div>

      )}

    </div>
  );
}


export default Cart;
