import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home-page">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <p className="hero-small">
            NEW COLLECTION
          </p>

          <h1>
            Upgrade Your
            <br />
            Everyday Tech
          </h1>

          <p>
            Discover the latest electronics at amazing prices.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Shop Now →
          </button>

        </div>

      </section>


      {/* =========================
          CATEGORIES SECTION
      ========================== */}

      <section className="home-categories">

        <div className="home-section-heading">

          <p className="section-label">
            SHOP BY CATEGORY
          </p>

          <h2>
            Find What You Need
          </h2>

        </div>


        <div className="category-grid">

          {/* MOBILE */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Mobile"
              )
            }
          >
            <span className="category-icon">
              📱
            </span>

            <span>
              Mobile
            </span>
          </button>


          {/* LAPTOP */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Laptop"
              )
            }
          >
            <span className="category-icon">
              💻
            </span>

            <span>
              Laptop
            </span>
          </button>


          {/* AUDIO */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Audio"
              )
            }
          >
            <span className="category-icon">
              🎧
            </span>

            <span>
              Audio
            </span>
          </button>


          {/* WEARABLES */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Wearable"
              )
            }
          >
            <span className="category-icon">
              ⌚
            </span>

            <span>
              Wearables
            </span>
          </button>


          {/* ACCESSORIES */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Accessories"
              )
            }
          >
            <span className="category-icon">
              🖱️
            </span>

            <span>
              Accessories
            </span>
          </button>


          {/* MONITORS */}

          <button
            onClick={() =>
              navigate(
                "/search?category=Monitor"
              )
            }
          >
            <span className="category-icon">
              🖥️
            </span>

            <span>
              Monitors
            </span>
          </button>

        </div>

      </section>


      {/* =========================
          FEATURED PRODUCTS
      ========================== */}

      <section className="home-featured">

        <div className="home-section-heading">

          <p className="section-label">
            OUR PRODUCTS
          </p>

          <h2>
            Featured Products
          </h2>

        </div>


        <div className="home-product-grid">

          {products.map((product) => {

            // Dynamic image from backend
            const imageUrl =
              product.imageUrl
                ? `http://localhost:8080${product.imageUrl}`
                : null;

            return (

              <div
                key={product.id}
                className="home-product-card"
                onClick={() =>
                  navigate(
                    `/products/${product.id}`
                  )
                }
              >

                {/* PRODUCT IMAGE */}

                <div className="home-product-image">

                  {imageUrl ? (

                    <img
                      src={imageUrl}
                      alt={product.name}
                    />

                  ) : (

                    <span>
                      No Image
                    </span>

                  )}

                </div>


                {/* PRODUCT DETAILS */}

                <div className="home-product-info">

                  <p>
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            );
          })}

        </div>

      </section>

    </div>
  );
}

export default Home;