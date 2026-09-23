import { Link } from "react-router-dom";
import { useState } from "react";

function Footer() {
  const [showFeedback, setShowFeedback] =
    useState(false);

  const [rating, setRating] = useState(0);

  const [feedback, setFeedback] =
    useState("");

  const [notification, setNotification] =
    useState({
      show: false,
      type: "",
      message: "",
    });

  // =========================================================
  // SUBMIT FEEDBACK
  // =========================================================

  async function handleSubmitFeedback(event) {
    event.preventDefault();

    if (rating === 0) {
      setNotification({
        show: true,
        type: "error",
        message:
          "Please select a rating before submitting.",
      });
      return;
    }

    if (!feedback.trim()) {
      setNotification({
        show: true,
        type: "error",
        message:
          "Please enter your feedback before submitting.",
      });
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setNotification({
        show: true,
        type: "error",
        message:
          "Please login to submit feedback.",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/feedback?rating=${rating}&comment=${encodeURIComponent(
          feedback.trim()
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to submit feedback"
        );
      }

      setNotification({
        show: true,
        type: "success",
        message:
          "Thank you! Your feedback has been submitted.",
      });

      setRating(0);
      setFeedback("");

      setTimeout(() => {
        setShowFeedback(false);

        setNotification({
          show: false,
          type: "",
          message: "",
        });
      }, 1800);
    } catch (error) {
      console.error(
        "Feedback submission error:",
        error
      );

      setNotification({
        show: true,
        type: "error",
        message:
          "Unable to submit feedback. Please try again.",
      });
    }
  }

  return (
    <>
      <footer className="site-footer">

        <div className="footer-container">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >
              My E-Commerce
            </Link>

            <p>
              Smart shopping made simple.
              Discover quality products and
              enjoy a smooth shopping
              experience.
            </p>

            <div className="footer-socials">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

            </div>

          </div>


          {/* =================================================
              SHOP
          ================================================= */}

          <div className="footer-column">

            <h3>Shop</h3>

            <Link to="/products">
              All Products
            </Link>

            <Link to="/search?category=Electronics">
              Electronics
            </Link>

            <Link to="/search?category=Home%20%26%20Kitchen">
              Home &amp; Kitchen
            </Link>

            <Link to="/search?category=Luggage">
              Luggage
            </Link>

            <Link to="/search?category=Men%27s%20Fashion">
              Men&apos;s Fashion
            </Link>

            <Link to="/search?category=Women%27s%20Fashion">
              Women&apos;s Fashion
            </Link>

            <Link to="/search?category=Toys">
              Toys
            </Link>

            <Link to="/search?category=Books">
              Books
            </Link>

            <Link to="/search?category=Health%20%26%20Household">
              Health &amp; Household
            </Link>

          </div>


          {/* =================================================
              CUSTOMER SUPPORT
          ================================================= */}

          <div className="footer-column">

            <h3>
              Customer Support
            </h3>

            <Link to="/orders">
              Order Tracking
            </Link>

            <Link to="/cart">
              Cart &amp; Checkout
            </Link>

            <Link to="/help">
              Help Center
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/returns">
              Returns &amp; Refunds
            </Link>

          </div>


          {/* =================================================
              ABOUT
          ================================================= */}

          <div className="footer-column">

            <h3>About</h3>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/about">
              Our Story
            </Link>

            <Link to="/about">
              Careers
            </Link>

            <Link to="/accessibility">
              Accessibility
            </Link>

          </div>

        </div>


        {/* ===================================================
            FEEDBACK
        =================================================== */}

        <div className="footer-feedback">

          <div>

            <h3>
              We&apos;d love to hear from you.
            </h3>

            <p>
              Have a suggestion or feedback?
              Let us know how we can make
              your shopping experience
              better.
            </p>

          </div>

          <button
            type="button"
            className="footer-feedback-button"
            onClick={() =>
              setShowFeedback(true)
            }
          >
            Share Feedback
          </button>

        </div>


        {/* ===================================================
            BOTTOM
        =================================================== */}

        <div className="footer-bottom">

          <p>
            © 2026 My E-Commerce. All rights reserved.
          </p>

          <div className="footer-legal">

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms of Service
            </Link>

            <Link to="/privacy">
              Privacy &amp; Security
            </Link>

          </div>

        </div>

      </footer>


      {/* =====================================================
          FEEDBACK OVERLAY
      ===================================================== */}

      {showFeedback && (
        <div
          className="feedback-overlay"
          onClick={() =>
            setShowFeedback(false)
          }
        >

          {/* FEEDBACK SIDEBAR */}

          <div
            className="feedback-sidebar"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="feedback-sidebar-header">

              <div>

                <span className="feedback-label">
                  FEEDBACK
                </span>

                <h2>
                  How was your experience?
                </h2>

              </div>

              <button
                type="button"
                className="feedback-close"
                onClick={() =>
                  setShowFeedback(false)
                }
                aria-label="Close feedback"
              >
                ×
              </button>

            </div>


            {/* DESCRIPTION */}

            <p className="feedback-description">
              Your feedback helps us improve
              the shopping experience.
            </p>


            {/* FORM */}

            <form
              onSubmit={handleSubmitFeedback}
            >

              {/* RATING */}

              <div className="feedback-rating-section">

                <label>
                  Rate your experience
                </label>

                <div className="feedback-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        className={
                          star <= rating
                            ? "feedback-star active"
                            : "feedback-star"
                        }
                        onClick={() =>
                          setRating(star)
                        }
                        aria-label={`Rate ${star} out of 5`}
                      >
                        ★
                      </button>
                    )
                  )}

                </div>

                <span className="feedback-rating-text">

                  {rating === 0
                    ? "Select a rating"
                    : `${rating} out of 5`}

                </span>

              </div>


              {/* FEEDBACK TEXT */}

              <div className="feedback-input-section">

                <label htmlFor="feedback">
                  Tell us what you think
                </label>

                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(
                      event.target.value
                    )
                  }
                  placeholder="Share your thoughts, suggestions, or experience..."
                  rows="6"
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="feedback-submit-button"
              >
                Submit Feedback
              </button>

            </form>

          </div>

        </div>
      )}


      {/* =====================================================
          FEEDBACK NOTIFICATION
      ===================================================== */}

      {notification.show && (
        <div
          className={`feedback-notification ${notification.type}`}
        >

          <div className="feedback-notification-icon">

            {notification.type === "success"
              ? "✓"
              : "!"}

          </div>

          <div>

            <strong>
              {notification.type ===
              "success"
                ? "Thank you"
                : "Notice"}
            </strong>

            <p>
              {notification.message}
            </p>

          </div>

        </div>
      )}

    </>
  );
}

export default Footer;