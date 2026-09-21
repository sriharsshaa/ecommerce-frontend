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

            {cart.map((product) => {

              const stock = Number(product.stock || 0);

              const isOutOfStock = stock === 0;

              const reachedStockLimit =
                product.quantity >= stock;

              return (

                <div
                  key={product.id}
                  className="cart-product"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="cart-product-image">

                    {product.imageUrl ? (

                      <img
                        src={`http://localhost:8080${product.imageUrl}`}
                        alt={product.name}
                      />

                    ) : (

                      <span>
                        No Image
                      </span>

                    )}

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


                    {/* STOCK */}

                    <p
                      className={
                        isOutOfStock
                          ? "cart-stock out-of-stock"
                          : reachedStockLimit
                          ? "cart-stock low-stock"
                          : "cart-stock in-stock"
                      }
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : `Stock: ${stock}`}
                    </p>


                    {/* QUANTITY */}

                    <div className="quantity-section">

                      <span>
                        Quantity
                      </span>

                      <div className="quantity-controls">

                        {/* DECREASE */}

                        <button
                          onClick={() =>
                            decreaseQuantity(product.id)
                          }
                          disabled={product.quantity <= 1}
                        >
                          −
                        </button>


                        {/* CURRENT QUANTITY */}

                        <span>
                          {product.quantity}
                        </span>


                        {/* INCREASE */}

                        <button
                          onClick={() =>
                            increaseQuantity(product.id)
                          }
                          disabled={
                            isOutOfStock ||
                            reachedStockLimit
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* STOCK LIMIT MESSAGE */}

                    {!isOutOfStock &&
                      reachedStockLimit && (

                        <p className="cart-stock-limit">
                          Maximum available quantity reached
                        </p>

                      )}

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

              );

            })}

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
                {cart.reduce(
                  (sum, product) =>
                    sum + product.quantity,
                  0
                )}
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