function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  return (
    <div className="cart-page">

      <div className="page-header">
        <p className="page-label">YOUR SHOPPING CART</p>
        <h1>Shopping Cart</h1>
        <p>
          Review your products before placing your order.
        </p>
      </div>

      {cart.length === 0 ? (

        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart and
            they will appear here.
          </p>
        </div>

      ) : (

        <div className="cart-layout">

          <div className="cart-products">

            {cart.map((product) => (

              <div
                key={product.id}
                className="cart-product"
              >

                <div className="cart-product-image">
                  <img
                    src={
                      product.id === 1
                        ? "/images/iphone15.png"
                        : product.id === 2
                        ? "/images/dell-laptop.png"
                        : "/images/sony_headphones.png"
                    }
                    alt={product.name}
                  />
                </div>

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

                  <div className="quantity-section">

                    <span>Quantity</span>

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

                <div className="cart-product-total">

                  <span>Subtotal</span>

                  <strong>
                    ₹
                    {(
                      product.price *
                      product.quantity
                    ).toLocaleString("en-IN")}
                  </strong>

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

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">
                FREE
              </span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;