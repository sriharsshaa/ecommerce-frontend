import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
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
          "Error fetching products:",
          error
        );
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <p className="hero-small">
            NEW COLLECTION
          </p>

          <h1>
            Upgrade Your
            <br />
            Everyday Life
          </h1>

          <p>
            Discover quality products across
            electronics, fashion, home essentials
            and more.
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


      {/* =====================================================
          CATEGORIES SECTION
      ===================================================== */}

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

          {/* ELECTRONICS */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Electronics"
              )
            }
          >
            <span className="category-icon">
              🔌
            </span>

            <span>
              Electronics
            </span>
          </button>


          {/* HOME & KITCHEN */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Home%20%26%20Kitchen"
              )
            }
          >
            <span className="category-icon">
              🏠
            </span>

            <span>
              Home &amp; Kitchen
            </span>
          </button>


          {/* LUGGAGE */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Luggage"
              )
            }
          >
            <span className="category-icon">
              🧳
            </span>

            <span>
              Luggage
            </span>
          </button>


          {/* MEN'S FASHION */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Men%27s%20Fashion"
              )
            }
          >
            <span className="category-icon">
              👔
            </span>

            <span>
              Men&apos;s Fashion
            </span>
          </button>


          {/* WOMEN'S FASHION */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Women%27s%20Fashion"
              )
            }
          >
            <span className="category-icon">
              👗
            </span>

            <span>
              Women&apos;s Fashion
            </span>
          </button>


          {/* TOYS */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Toys"
              )
            }
          >
            <span className="category-icon">
              🧸
            </span>

            <span>
              Toys
            </span>
          </button>


          {/* BOOKS */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Books"
              )
            }
          >
            <span className="category-icon">
              📚
            </span>

            <span>
              Books
            </span>
          </button>


          {/* HEALTH & HOUSEHOLD */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/search?category=Health%20%26%20Household"
              )
            }
          >
            <span className="category-icon">
              🧴
            </span>

            <span>
              Health &amp; Household
            </span>
          </button>

        </div>

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

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
                      product.price || 0
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