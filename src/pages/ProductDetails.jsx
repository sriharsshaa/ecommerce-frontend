import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails({ addToCart, showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Reviews
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

        // Find related products
        if (selectedProduct) {
          const related = data
            .filter(
              (item) =>
                item.category === selectedProduct.category &&
                item.id !== selectedProduct.id
            )
            .slice(0, 4);

          setRelatedProducts(related);
        } else {
          setRelatedProducts([]);
        }

        setQuantity(1);
      } catch (error) {
        console.error("Product fetch error:", error);
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
      setReviewsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/reviews/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch reviews"
          );
        }

        const data = await response.json();

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
  // QUANTITY
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
      // Remove
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

      // Add
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

      setReviews((currentReviews) => [
        ...currentReviews,
        newReview,
      ]);

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
  // ADD TO CART
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

    addToCart(product.id, quantity);
  }

  // =====================================================
  // BUY NOW
  // =====================================================

  function handleBuyNow() {
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

    addToCart(product.id, quantity);
    navigate("/checkout");
  }

  // =====================================================
  // SPECIFICATION HELPER
  // =====================================================

  function getSpecifications() {
    if (!product) {
      return [];
    }

    const specifications = [];

    function addSpecification(label, value) {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        specifications.push({
          label,
          value,
        });
      }
    }

    // ===================================================
    // COMMON
    // ===================================================

    addSpecification("Brand", product.brand);

    // ===================================================
    // ELECTRONICS
    // ===================================================

    if (product.category === "Electronics") {
      addSpecification(
        "Product Type",
        product.productType
      );

      const productType = product.productType;

      // -------------------------------
      // Mobile / Tablet
      // -------------------------------

      if (
        productType === "Mobile" ||
        productType === "Tablet"
      ) {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Storage",
          product.storage
        );

        addSpecification(
          "RAM",
          product.ram
        );

        addSpecification(
          "Screen Size",
          product.screenSize
        );

        addSpecification(
          "Operating System",
          product.operatingSystem
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Laptop
      // -------------------------------

      else if (productType === "Laptop") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Screen Size",
          product.screenSize
        );

        addSpecification(
          "Processor",
          product.cpuModel
        );

        addSpecification(
          "RAM",
          product.ramMemoryInstalledSize ||
            product.ram
        );

        addSpecification(
          "Storage",
          product.hardDiskSize ||
            product.storage
        );

        addSpecification(
          "Operating System",
          product.operatingSystem
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Audio
      // -------------------------------

      else if (productType === "Audio") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Form Factor",
          product.formFactor
        );

        addSpecification(
          "Ear Placement",
          product.earPlacement
        );

        addSpecification(
          "Noise Control",
          product.noiseControl
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );

        addSpecification(
          "Connection Type",
          product.connectionType
        );
      }

      // -------------------------------
      // Wearable
      // -------------------------------

      else if (productType === "Wearable") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Screen Size",
          product.screenSize
        );

        addSpecification(
          "Storage",
          product.storage
        );

        addSpecification(
          "Operating System",
          product.operatingSystem
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Monitor
      // -------------------------------

      else if (productType === "Monitor") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Screen Size",
          product.screenSize
        );

        addSpecification(
          "Resolution",
          product.resolution
        );

        addSpecification(
          "Refresh Rate",
          product.refreshRate
        );

        addSpecification(
          "Panel Type",
          product.panelType
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Smart TV
      // -------------------------------

      else if (productType === "Smart TV") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Screen Size",
          product.screenSize
        );

        addSpecification(
          "Resolution",
          product.resolution
        );

        addSpecification(
          "Refresh Rate",
          product.refreshRate
        );

        addSpecification(
          "Operating System",
          product.operatingSystem
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Camera
      // -------------------------------

      else if (productType === "Camera") {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Resolution",
          product.resolution
        );

        addSpecification(
          "Storage",
          product.storage
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );
      }

      // -------------------------------
      // Other Electronics
      // -------------------------------

      else {
        addSpecification(
          "Model Name",
          product.modelName
        );

        addSpecification(
          "Color",
          product.color
        );

        addSpecification(
          "Connectivity",
          product.connectivity
        );

        addSpecification(
          "Compatibility",
          product.compatibility
        );
      }
    }

    // ===================================================
    // HOME & KITCHEN
    // ===================================================

    else if (
      product.category ===
      "Home & Kitchen"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Model Name",
        product.modelName
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Capacity",
        product.capacity
      );

      addSpecification(
        "Material",
        product.material
      );

      addSpecification(
        "Size",
        product.size
      );
    }

    // ===================================================
    // LUGGAGE
    // ===================================================

    else if (
      product.category === "Luggage"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Model Name",
        product.modelName
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Size",
        product.size
      );

      addSpecification(
        "Capacity",
        product.capacity
      );

      addSpecification(
        "Material",
        product.material
      );
    }

    // ===================================================
    // MEN'S FASHION
    // ===================================================

    else if (
      product.category === "Men's Fashion"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Size",
        product.size
      );

      addSpecification(
        "Material",
        product.material
      );

      addSpecification(
        "Fit",
        product.fit
      );

      addSpecification(
        "Pattern",
        product.pattern
      );

      addSpecification(
        "Occasion",
        product.occasion
      );
    }

    // ===================================================
    // WOMEN'S FASHION
    // ===================================================

    else if (
      product.category ===
      "Women's Fashion"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Size",
        product.size
      );

      addSpecification(
        "Material",
        product.material
      );

      addSpecification(
        "Fit",
        product.fit
      );

      addSpecification(
        "Pattern",
        product.pattern
      );

      addSpecification(
        "Occasion",
        product.occasion
      );
    }

    // ===================================================
    // TOYS
    // ===================================================

    else if (
      product.category === "Toys"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Age Group",
        product.ageGroup
      );

      addSpecification(
        "Material",
        product.material
      );

      addSpecification(
        "Battery Required",
        product.batteryRequired
      );
    }

    // ===================================================
    // BOOKS
    // ===================================================

    else if (
      product.category === "Books"
    ) {
      addSpecification(
        "Book Type",
        product.productType
      );

      addSpecification(
        "Author",
        product.author
      );

      addSpecification(
        "Publisher",
        product.publisher
      );

      addSpecification(
        "ISBN",
        product.isbn
      );

      addSpecification(
        "Language",
        product.language
      );

      addSpecification(
        "Edition",
        product.edition
      );

      addSpecification(
        "Format",
        product.format
      );

      addSpecification(
        "Pages",
        product.pages
      );
    }

    // ===================================================
    // HEALTH & HOUSEHOLD
    // ===================================================

    else if (
      product.category ===
      "Health & Household"
    ) {
      addSpecification(
        "Product Type",
        product.productType
      );

      addSpecification(
        "Color",
        product.color
      );

      addSpecification(
        "Material",
        product.material
      );

      addSpecification(
        "Capacity",
        product.capacity
      );

      addSpecification(
        "Pack Size",
        product.packSize
      );

      addSpecification(
        "Usage",
        product.usage
      );
    }

    return specifications;
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
  // IMAGE
  // =====================================================

  const imageUrl = product.imageUrl
    ? `http://localhost:8080${product.imageUrl}`
    : null;

  // =====================================================
  // STOCK
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
  // REVIEWS
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

  // =====================================================
  // SPECIFICATIONS
  // =====================================================

  const specifications =
    getSpecifications();

  return (
    <div className="product-details-page">

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <div className="product-details-container">

        {/* PRODUCT IMAGE */}

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

        {/* PRODUCT INFORMATION */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}
          </p>

          {/* STOCK */}

          <p
            className={`product-stock-status ${stockClass}`}
          >
            {stockMessage}
          </p>

          {/* RATING SUMMARY */}

          <div className="product-rating-summary">

            <span className="rating-stars">

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

          {/* QUANTITY */}

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

          {/* ACTION BUTTONS */}

          <div className="product-details-actions">

            <button
              type="button"
              className="product-details-cart-button"
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              {stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              type="button"
              className="product-details-buy-now-button"
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              {stock === 0
                ? "Out of Stock"
                : "Buy Now"}
            </button>

            <button
              type="button"
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
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="product-specifications">

        <h2>Product Information</h2>

        {specifications.length > 0 ? (
          <div className="specifications-table">

            {specifications.map(
              (specification, index) => (
                <div
                  className="specification-row"
                  key={`${specification.label}-${index}`}
                >
                  <span>
                    {specification.label}
                  </span>

                  <strong>
                    {specification.value}
                  </strong>
                </div>
              )
            )}

          </div>
        ) : (
          <p>
            No additional product
            information available.
          </p>
        )}

      </div>

      {/* =====================================================
          ABOUT PRODUCT
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

        {/* REVIEW FORM */}

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

        {/* REVIEW LIST */}

        <div className="reviews-list">

          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">

              <p>No reviews yet.</p>

              <p>
                Be the first to review this
                product!
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
                        Number(
                          review.rating
                        )
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

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      {relatedProducts.length > 0 && (
        <div className="related-products">

          <div className="related-products-header">

            <h2>Related Products</h2>

            <p>
              More products from the{" "}
              {product.category} category
            </p>

          </div>

          <div className="related-products-grid">

            {relatedProducts.map(
              (relatedProduct) => {

                const relatedImageUrl =
                  relatedProduct.imageUrl
                    ? `http://localhost:8080${relatedProduct.imageUrl}`
                    : null;

                return (
                  <div
                    className="related-product-card"
                    key={relatedProduct.id}
                  >

                    <div className="related-product-image">

                      {relatedImageUrl ? (
                        <img
                          src={relatedImageUrl}
                          alt={relatedProduct.name}
                        />
                      ) : (
                        <span>No Image</span>
                      )}

                    </div>

                    <div className="related-product-info">

                      <p className="related-product-category">
                        {relatedProduct.category}
                      </p>

                      <h3>
                        {relatedProduct.name}
                      </h3>

                      <p className="related-product-price">
                        ₹
                        {Number(
                          relatedProduct.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <button
                        className="related-product-button"
                        onClick={() =>
                          navigate(
                            `/products/${relatedProduct.id}`
                          )
                        }
                      >
                        View Product
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductDetails;