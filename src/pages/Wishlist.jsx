import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist({ addToCart, showNotification }) {

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // =========================================================
  // FETCH WISHLIST + PRODUCTS
  // =========================================================

  useEffect(() => {
    fetchWishlist();
    fetchProducts();
  }, []);

  // =========================================================
  // FETCH WISHLIST
  // =========================================================

  async function fetchWishlist() {

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {

      const response =
        await fetch(
          "http://localhost:8080/api/wishlist",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch wishlist"
        );
      }

      const data =
        await response.json();

      setWishlist(data);
    } catch (error) {

      console.error(
        "Fetch Wishlist error:",
        error
      );
    }
  }

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  async function fetchProducts() {
    try {

      const response =
        await fetch(
          "http://localhost:8080/api/products"
        );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch products"
        );
      }

      const data =
        await response.json();

      setProducts(data);
    } catch (error) {

      console.error(
        "Fetch products error:",
        error
      );
    }
  }

  // =========================================================
  // REMOVE FROM WISHLIST
  // =========================================================

  async function removeFromWishlist(
    productId
  ) {

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {

      const response =
        await fetch(
          `http://localhost:8080/api/wishlist/${productId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to remove from wishlist"
        );
      }

      // Remove immediately from screen
      setWishlist(
        (currentWishlist) =>
          currentWishlist.filter(
            (item) =>
              Number(item.productId) !==
              Number(productId)
          )
      );

      showNotification(
        "Removed from wishlist",
        "success"
      );

    } catch (error) {

      console.error(
        "Remove Wishlist error:",
        error
      );

      showNotification(
        "Failed to remove from wishlist",
        "error"
      );
    }
  }

  // =========================================================
  // DISPLAY WISHLIST
  // =========================================================

  return (
    <div className="wishlist-page">

      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="wishlist-grid">

          {wishlist.map((item) => {

            const product =
              products.find(
                (product) =>
                  Number(product.id) ===
                  Number(item.productId)
              );

            if (!product) {
              return null;
            }

            // =================================================
            // DYNAMIC PRODUCT IMAGE
            // =================================================

            const imageUrl = product.imageUrl
              ? `http://localhost:8080${product.imageUrl}`
              : null;

            return (

              <div
                className="wishlist-card"
                key={item.id}
                onClick={() =>
                  navigate(
                    `/products/${product.id}`
                  )
                }
              >

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                {imageUrl ? (

                  <img
                    className="wishlist-image"
                    src={imageUrl}
                    alt={product.name}
                  />

                ) : (

                  <div className="wishlist-image">
                    No Image
                  </div>

                )}

                {/* =================================================
                    PRODUCT NAME
                ================================================= */}

                <h3>
                  {product.name}
                </h3>

                {/* =================================================
                    PRODUCT PRICE
                ================================================= */}

                <p>
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}
                </p>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="wishlist-actions">

                  {/* ADD TO CART */}

                  <button
                    className="wishlist-cart-button"
                    onClick={(event) => {

                      event.stopPropagation();

                      addToCart(
                        product.id
                      );

                    }}
                  >
                    Add to Cart
                  </button>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="wishlist-remove-button"
                    onClick={(event) => {

                      event.stopPropagation();

                      removeFromWishlist(
                        product.id
                      );

                    }}
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                  >
                    ♥
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Wishlist;