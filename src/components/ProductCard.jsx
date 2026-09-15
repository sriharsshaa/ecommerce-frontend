import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, addToWishlist }) {
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const productImages = {
    1: "/images/iphone15.png",
    2: "/images/dell-laptop.png",
    3: "/images/sony_headphones.png",
    4: "/images/samsung_galaxy_s24.png",
    5: "/images/hp_pavilion.png",
    6: "/images/jbl_bluetooth_speaker.png",
    7: "/images/apple_watch_series_9.png",
    8: "/images/logitech_mouse.png",
    9: "/images/samsung_27inch_monitor.png",
  };

  // Check whether this product is already in wishlist
  useEffect(() => {
    async function checkWishlist() {
      const token = localStorage.getItem("token");

      if (!token) {
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
            Number(item.productId) === Number(product.id)
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

  async function handleWishlist(event) {
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add products to wishlist.");
      return;
    }

    try {
      // If already in wishlist → remove
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

      // If not in wishlist → add
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

  return (
    <div
      className="product-card"
      onClick={() =>
        navigate(`/products/${product.id}`)
      }
    >
      <div className="product-card-image">

        <img
          src={productImages[product.id]}
          alt={product.name}
        />

        <button
          className={`wishlist-button ${
            isWishlisted ? "wishlisted" : ""
          }`}
          onClick={handleWishlist}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

      </div>

      <div className="product-card-info">

        <p>{product.category}</p>

        <h3>{product.name}</h3>

        <strong>
          ₹{product.price.toLocaleString("en-IN")}
        </strong>

      </div>
    </div>
  );
}

export default ProductCard;