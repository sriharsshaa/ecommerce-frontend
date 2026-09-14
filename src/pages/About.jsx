function About() {
  return (
    <div className="info-page">

      <div className="info-page-container">

        <span className="info-page-label">
          ABOUT US
        </span>

        <h1>
          About My E-Commerce
        </h1>

        <p className="info-page-intro">
          We created My E-Commerce to make online shopping
          simple, convenient, and enjoyable.
        </p>

        <section className="info-section">
          <h2>Our Story</h2>

          <p>
            My E-Commerce is an online shopping platform designed
            for customers to easily discover and purchase electronic
            products from different categories.
          </p>

          <p>
            Our goal is to provide a clean shopping experience where
            customers can browse products, manage their cart, place
            orders, and track their purchases with ease.
          </p>
        </section>

        <section className="info-section">
          <h2>What We Offer</h2>

          <div className="info-cards">

            <div className="info-card">
              <h3>Quality Products</h3>
              <p>
                Explore a selection of electronics and everyday
                technology products.
              </p>
            </div>

            <div className="info-card">
              <h3>Simple Shopping</h3>
              <p>
                Browse products, add items to your cart, and
                complete your order easily.
              </p>
            </div>

            <div className="info-card">
              <h3>Easy Order Tracking</h3>
              <p>
                View your previous orders and check your order
                details whenever you need.
              </p>
            </div>

          </div>
        </section>

        <section className="info-section">
          <h2>Our Goal</h2>

          <p>
            We aim to build a reliable and user-friendly shopping
            experience while continuously improving our products,
            services, and technology.
          </p>
        </section>

      </div>

    </div>
  );
}

export default About;