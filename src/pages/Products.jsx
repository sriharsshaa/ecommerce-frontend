import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

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
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* HERO SECTION */}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">
            NEW COLLECTION
          </p>

          <h1>
            Upgrade Your
            <br />
            Everyday Tech
          </h1>

          <p>
            Discover the latest electronics
            at amazing prices.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("products-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* PRODUCTS SECTION */}

      <section
        className="products-section"
        id="products-section"
      >

        <div className="products-heading">
          <div>
            <p className="section-label">
              OUR PRODUCTS
            </p>

            <h2>
              Featured Products
            </h2>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {/* PRODUCT GRID */}

        <div className="products-grid">

          {filteredProducts.length === 0 ? (

            <p className="no-products">
              No products found.
            </p>

          ) : (

            filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              )
            )

          )}

        </div>

      </section>

    </div>
  );
}

export default Products;