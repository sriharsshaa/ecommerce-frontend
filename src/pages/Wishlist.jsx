import { useState, useEffect } from "react";

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

function Wishlist() {
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
        throw new Error(
          "Failed to fetch wishlist"
        );
      }

      const data = await response.json();

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
      const response = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

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

  async function removeFromWishlist(productId) {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlist/${productId}`,
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

      // Remove immediately from the screen
      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (item) =>
            Number(item.productId) !==
            Number(productId)
        )
      );
    } catch (error) {
      console.error(
        "Remove Wishlist error:",
        error
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

            const product = products.find(
              (product) =>
                Number(product.id) ===
                Number(item.productId)
            );

            if (!product) {
              return null;
            }

            return (
              <div
                className="wishlist-card"
                key={item.id}
              >

                <img
                  className="wishlist-image"
                  src={productImages[product.id]}
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <p>
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <button
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                >
                  Remove
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Wishlist;
