import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const imageUrl = product.imageUrl
    ? `http://localhost:8080${product.imageUrl}`
    : null;

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  useEffect(() => {
    async function checkWishlist() {
      const token =
        localStorage.getItem("token");

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
            Number(item.productId) ===
            Number(product.id)
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
  }, [product.id]);

  // =====================================================
  // WISHLIST
  // =====================================================

  async function handleWishlist(event) {
    event.stopPropagation();

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login to add products to wishlist."
      );
      return;
    }

    try {
      // -------------------------------------------------
      // REMOVE
      // -------------------------------------------------

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
        return;
      }

      // -------------------------------------------------
      // ADD
      // -------------------------------------------------

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
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="product-card"
      onClick={() =>
        navigate(
          `/products/${product.id}`
        )
      }
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="product-card-image">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
          />
        ) : (
          <span>No Image</span>
        )}

        {/* =================================================
            WISHLIST BUTTON
        ================================================= */}

        <button
          type="button"
          className={`wishlist-button ${
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
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <span className="wishlist-heart">
            {isWishlisted
              ? "♥"
              : "♡"}
          </span>
        </button>

      </div>


      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <div className="product-card-info">

        <p>
          {product.category}
        </p>

        <h3>
          {product.name}
        </h3>

        <strong>
          ₹
          {Number(
            product.price || 0
          ).toLocaleString("en-IN")}
        </strong>

      </div>

    </div>
  );
}

export default ProductCard;