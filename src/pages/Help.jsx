function Help() {
  return (
    <div className="info-page">

      <div className="info-page-container">

        <span className="info-page-label">
          HELP CENTER
        </span>

        <h1>
          How can we help?
        </h1>

        <p className="info-page-intro">
          Find answers to common questions about shopping,
          orders, payments, and your account.
        </p>

        <div className="info-cards">

          <div className="info-card">
            <h2>How do I place an order?</h2>
            <p>
              Browse our products, add the products you want to
              your cart, and proceed to checkout. Select your
              payment method and place your order.
            </p>
          </div>

          <div className="info-card">
            <h2>How can I track my order?</h2>
            <p>
              Open the Orders section from the navigation bar.
              You can view your previous orders and their details.
            </p>
          </div>

          <div className="info-card">
            <h2>How do I change my cart quantity?</h2>
            <p>
              Open your Cart and use the plus or minus buttons
              next to a product to change its quantity.
            </p>
          </div>

          <div className="info-card">
            <h2>What payment methods are available?</h2>
            <p>
              Currently, the checkout supports Cash on Delivery,
              UPI, and Card as payment options.
            </p>
          </div>

          <div className="info-card">
            <h2>Can I return a product?</h2>
            <p>
              Please check our Returns & Refunds page for
              information about our return process.
            </p>
          </div>

          <div className="info-card">
            <h2>Need more help?</h2>
            <p>
              If you cannot find the answer you're looking for,
              visit our Contact Us page to get in touch with us.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Help;
