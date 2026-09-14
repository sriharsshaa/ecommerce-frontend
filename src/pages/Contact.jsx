function Contact() {
  return (
    <div className="info-page">

      <div className="info-page-container">

        <span className="info-page-label">
          CONTACT US
        </span>

        <h1>
          We're here to help
        </h1>

        <p className="info-page-intro">
          Have a question about an order, product, payment, or
          anything else? We'd be happy to help.
        </p>

        <div className="contact-grid">

          <div className="info-card">
            <h2>Customer Support</h2>

            <p>
              For questions about your orders, products, delivery,
              or returns, contact our support team.
            </p>

            <strong>Email</strong>
            <p>support@my-ecommerce.com</p>
          </div>

          <div className="info-card">
            <h2>Order Support</h2>

            <p>
              Need help with an existing order? Keep your order
              number ready so we can assist you quickly.
            </p>

            <strong>Email</strong>
            <p>orders@my-ecommerce.com</p>
          </div>

          <div className="info-card">
            <h2>Business Enquiries</h2>

            <p>
              For partnerships, business enquiries, or other
              professional requests, contact us here.
            </p>

            <strong>Email</strong>
            <p>business@my-ecommerce.com</p>
          </div>

        </div>

        <section className="info-section">
          <h2>Before contacting us</h2>

          <p>
            You can also check your order status from the
            Orders section or browse our Help Center for
            commonly asked questions.
          </p>
        </section>

      </div>

    </div>
  );
}

export default Contact;
