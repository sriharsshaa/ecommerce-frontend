import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails({ addToCart, showNotification }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const selectedProduct = data.find(
          (item) => item.id === Number(id)
        );

        setProduct(selectedProduct);

        // Reset quantity whenever product changes
        setQuantity(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  useEffect(() => {
    async function checkWishlist() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const exists = data.some(
          (item) =>
            Number(item.productId) === Number(id)
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error(
          "Wishlist check error:",
          error
        );
      }
    }

    checkWishlist();
  }, [id]);

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  useEffect(() => {
    async function fetchReviews() {
      console.log(
        "Fetching reviews for product:",
        id
      );

      try {
        const response = await fetch(
          `http://localhost:8080/api/reviews/${id}`
        );

        console.log(
          "Review response:",
          response
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch reviews"
          );
        }

        const data = await response.json();

        console.log(
          "Reviews received:",
          data
        );

        setReviews(data);
      } catch (error) {
        console.error(
          "Reviews fetch error:",
          error
        );
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchReviews();
  }, [id]);

  // =====================================================
  // QUANTITY FUNCTIONS
  // =====================================================

  function decreaseQuantity() {
    setQuantity((currentQuantity) => {
      if (currentQuantity > 1) {
        return currentQuantity - 1;
      }

      return 1;
    });
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) => {
      if (currentQuantity < product.stock) {
        return currentQuantity + 1;
      }

      showNotification(
        `Only ${product.stock} item${
          product.stock === 1 ? "" : "s"
        } available`,
        "error"
      );

      return currentQuantity;
    });
  }

  // =====================================================
  // ADD / REMOVE WISHLIST
  // =====================================================

  async function handleWishlist() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login to add products to wishlist."
      );
      return;
    }

    try {
      // ==========================================
      // REMOVE FROM WISHLIST
      // ==========================================

      if (isWishlisted) {
        const response = await fetch(
          `http://localhost:8080/api/wishlist/${product.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to remove from wishlist"
          );
        }

        setIsWishlisted(false);

        showNotification(
          "Product removed from wishlist",
          "success"
        );

        return;
      }

      // ==========================================
      // ADD TO WISHLIST
      // ==========================================

      const response = await fetch(
        `http://localhost:8080/api/wishlist/${product.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add to wishlist"
        );
      }

      setIsWishlisted(true);

      showNotification(
        "Product added to wishlist ❤️",
        "success"
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );
    }
  }

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  async function handleSubmitReview() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to write a review.");
      return;
    }

    if (selectedRating === 0) {
      showNotification(
        "Please select a rating",
        "error"
      );
      return;
    }

    if (!reviewComment.trim()) {
      showNotification(
        "Please write a review",
        "error"
      );
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${product.id}?rating=${selectedRating}&comment=${encodeURIComponent(
          reviewComment
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
          "Failed to submit review"
        );
      }

      const newReview = await response.json();

      // Add new review to existing list
      setReviews((currentReviews) => [
        ...currentReviews,
        newReview,
      ]);

      // Reset form
      setSelectedRating(0);
      setReviewComment("");
      setShowReviewForm(false);

      showNotification(
        "Review submitted successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Submit review error:",
        error
      );

      showNotification(
        "Failed to submit review",
        "error"
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  // =====================================================
  // HANDLE ADD TO CART
  // =====================================================

  function handleAddToCart() {
    if (product.stock <= 0) {
      showNotification(
        "This product is out of stock",
        "error"
      );
      return;
    }

    if (quantity > product.stock) {
      showNotification(
        `Only ${product.stock} item${
          product.stock === 1 ? "" : "s"
        } available`,
        "error"
      );
      return;
    }

    // Pass both product ID and selected quantity
    addToCart(product.id, quantity);
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <p>Loading...</p>;
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return <p>Product not found</p>;
  }

  // =====================================================
  // DYNAMIC PRODUCT IMAGE
  // =====================================================

  const imageUrl = product.imageUrl
    ? `http://localhost:8080${product.imageUrl}`
    : null;

  // =====================================================
  // STOCK STATUS
  // =====================================================

  const stock = Number(product.stock || 0);

  let stockMessage = "";
  let stockClass = "";

  if (stock === 0) {
    stockMessage = "Out of Stock";
    stockClass = "out-of-stock";
  } else if (stock <= 5) {
    stockMessage = `Only ${stock} left`;
    stockClass = "low-stock";
  } else {
    stockMessage = "In Stock";
    stockClass = "in-stock";
  }

  // =====================================================
  // REVIEW CALCULATIONS
  // =====================================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="product-details-page">

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <div className="product-details-container">

        {/* Product Image */}

        <div className="product-details-image">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
            />
          ) : (
            <span>No Image</span>
          )}

        </div>

        {/* Product Information */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          {/* =================================================
              STOCK STATUS
          ================================================= */}

          <p className={`product-stock-status ${stockClass}`}>
            {stockMessage}
          </p>

          {/* =================================================
              RATING SUMMARY
          ================================================= */}

          <div className="product-rating-summary">

            <span className="rating-stars">

              {"★".repeat(
                Math.round(Number(averageRating))
              )}

              {"☆".repeat(
                5 -
                  Math.round(
                    Number(averageRating)
                  )
              )}

            </span>

            <span className="rating-number">
              {averageRating}
            </span>

            <span className="rating-count">
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"})
            </span>

          </div>

          {/* =================================================
              QUANTITY SELECTOR
          ================================================= */}

          {stock > 0 && (
            <div className="product-quantity-section">

              <span className="quantity-label">
                Quantity:
              </span>

              <div className="quantity-selector">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="quantity-value">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              CART + WISHLIST BUTTONS
          ================================================= */}

          <div className="product-details-actions">

            <button
              className="product-details-cart-button"
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              {stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              className={`product-details-wishlist-button ${
                isWishlisted
                  ? "wishlisted"
                  : ""
              }`}
              onClick={handleWishlist}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {isWishlisted ? "♥" : "♡"}
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION / SPECIFICATIONS
      ===================================================== */}

      <div className="product-specifications">

        <h2>Product Information</h2>

        <div className="specifications-table">

          {/* =================================================
              LAPTOP
          ================================================= */}

          {product.category === "Laptop" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>
                    {product.modelName}
                  </strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>
                    {product.screenSize}
                  </strong>
                </div>
              )}

              {product.hardDiskSize && (
                <div className="specification-row">
                  <span>Hard Disk Size</span>
                  <strong>
                    {product.hardDiskSize}
                  </strong>
                </div>
              )}

              {product.cpuModel && (
                <div className="specification-row">
                  <span>CPU Model</span>
                  <strong>
                    {product.cpuModel}
                  </strong>
                </div>
              )}

              {product.ramMemoryInstalledSize && (
                <div className="specification-row">
                  <span>RAM</span>
                  <strong>
                    {product.ramMemoryInstalledSize}
                  </strong>
                </div>
              )}

            </>
          )}

          {/* =================================================
              AUDIO
          ================================================= */}

          {product.category === "Audio" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>
                    {product.color}
                  </strong>
                </div>
              )}

              {product.formFactor && (
                <div className="specification-row">
                  <span>Form Factor</span>
                  <strong>
                    {product.formFactor}
                  </strong>
                </div>
              )}

              {product.noiseControl && (
                <div className="specification-row">
                  <span>Noise Control</span>
                  <strong>
                    {product.noiseControl}
                  </strong>
                </div>
              )}

              {product.earPlacement && (
                <div className="specification-row">
                  <span>Ear Placement</span>
                  <strong>
                    {product.earPlacement}
                  </strong>
                </div>
              )}

            </>
          )}

          {/* =================================================
              MOBILE
          ================================================= */}

          {product.category === "Mobile" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.storage && (
                <div className="specification-row">
                  <span>Storage</span>
                  <strong>
                    {product.storage}
                  </strong>
                </div>
              )}

              {product.ram && (
                <div className="specification-row">
                  <span>RAM</span>
                  <strong>
                    {product.ram}
                  </strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>
                    {product.screenSize}
                  </strong>
                </div>
              )}

              {product.operatingSystem && (
                <div className="specification-row">
                  <span>Operating System</span>
                  <strong>
                    {product.operatingSystem}
                  </strong>
                </div>
              )}

            </>
          )}

          {/* =================================================
              WEARABLE
          ================================================= */}

          {product.category === "Wearable" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>
                    {product.modelName}
                  </strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>
                    {product.screenSize}
                  </strong>
                </div>
              )}

              {product.storage && (
                <div className="specification-row">
                  <span>Storage</span>
                  <strong>
                    {product.storage}
                  </strong>
                </div>
              )}

              {product.operatingSystem && (
                <div className="specification-row">
                  <span>Operating System</span>
                  <strong>
                    {product.operatingSystem}
                  </strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>
                    {product.color}
                  </strong>
                </div>
              )}

              {product.connectivity && (
                <div className="specification-row">
                  <span>Connectivity</span>
                  <strong>
                    {product.connectivity}
                  </strong>
                </div>
              )}

            </>
          )}

          {/* =================================================
              ACCESSORIES
          ================================================= */}

          {product.category === "Accessories" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>
                    {product.modelName}
                  </strong>
                </div>
              )}

              {product.color && (
                <div className="specification-row">
                  <span>Color</span>
                  <strong>
                    {product.color}
                  </strong>
                </div>
              )}

              {product.connectionType && (
                <div className="specification-row">
                  <span>Connection Type</span>
                  <strong>
                    {product.connectionType}
                  </strong>
                </div>
              )}

              {product.compatibility && (
                <div className="specification-row">
                  <span>Compatibility</span>
                  <strong>
                    {product.compatibility}
                  </strong>
                </div>
              )}

            </>
          )}

          {/* =================================================
              MONITOR
          ================================================= */}

          {product.category === "Monitor" && (
            <>

              {product.brand && (
                <div className="specification-row">
                  <span>Brand</span>
                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              {product.modelName && (
                <div className="specification-row">
                  <span>Model Name</span>
                  <strong>
                    {product.modelName}
                  </strong>
                </div>
              )}

              {product.screenSize && (
                <div className="specification-row">
                  <span>Screen Size</span>
                  <strong>
                    {product.screenSize}
                  </strong>
                </div>
              )}

              {product.resolution && (
                <div className="specification-row">
                  <span>Resolution</span>
                  <strong>
                    {product.resolution}
                  </strong>
                </div>
              )}

              {product.refreshRate && (
                <div className="specification-row">
                  <span>Refresh Rate</span>
                  <strong>
                    {product.refreshRate}
                  </strong>
                </div>
              )}

              {product.panelType && (
                <div className="specification-row">
                  <span>Panel Type</span>
                  <strong>
                    {product.panelType}
                  </strong>
                </div>
              )}

            </>
          )}

        </div>
      </div>

      {/* =====================================================
          ABOUT THIS PRODUCT
      ===================================================== */}

      {product.description && (
        <div className="about-product">

          <h2>About this product</h2>

          <p>
            {product.description}
          </p>

        </div>
      )}

      {/* =====================================================
          CUSTOMER REVIEWS
      ===================================================== */}

      <div className="product-reviews">

        <div className="reviews-header">

          <div>

            <h2>Customer Reviews</h2>

            {reviews.length > 0 && (
              <div className="reviews-summary">

                <span className="reviews-average">
                  {averageRating}
                </span>

                <span className="reviews-stars">

                  {"★".repeat(
                    Math.round(
                      Number(averageRating)
                    )
                  )}

                  {"☆".repeat(
                    5 -
                      Math.round(
                        Number(averageRating)
                      )
                  )}

                </span>

                <span className="reviews-count">
                  {reviews.length}{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"}
                </span>

              </div>
            )}

          </div>

          <button
            className="write-review-button"
            onClick={() =>
              setShowReviewForm(
                !showReviewForm
              )
            }
          >
            {showReviewForm
              ? "Cancel"
              : "Write a Review"}
          </button>

        </div>

        {/* =================================================
            REVIEW FORM
        ================================================= */}

        {showReviewForm && (
          <div className="review-form">

            <h3>Write a Review</h3>

            <div className="review-rating-input">

              <p>Your Rating:</p>

              <div className="rating-selector">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      className={
                        star <= selectedRating
                          ? "rating-star selected"
                          : "rating-star"
                      }
                      onClick={() =>
                        setSelectedRating(
                          star
                        )
                      }
                    >
                      {star <= selectedRating
                        ? "★"
                        : "☆"}
                    </button>
                  )
                )}

              </div>

            </div>

            <div className="review-comment">

              <label htmlFor="reviewComment">
                Your Review
              </label>

              <textarea
                id="reviewComment"
                value={reviewComment}
                onChange={(event) =>
                  setReviewComment(
                    event.target.value
                  )
                }
                placeholder="Share your experience with this product..."
                rows="5"
              />

            </div>

            <button
              className="submit-review-button"
              onClick={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>
        )}

        {/* =================================================
            REVIEW LIST
        ================================================= */}

        <div className="reviews-list">

          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">

              <p>
                No reviews yet.
              </p>

              <p>
                Be the first to review this product!
              </p>

            </div>
          ) : (
            reviews.map((review) => (
              <div
                className="review-card"
                key={review.id}
              >

                <div className="review-card-header">

                  <div className="review-rating">

                    {"★".repeat(
                      Number(review.rating)
                    )}

                    {"☆".repeat(
                      5 -
                        Number(review.rating)
                    )}

                  </div>

                  <span className="review-date">

                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : ""}

                  </span>

                </div>

                <p className="review-comment-text">
                  {review.comment}
                </p>

                <p className="review-user">
                  — Customer
                </p>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;