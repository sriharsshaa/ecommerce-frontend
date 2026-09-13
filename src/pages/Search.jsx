import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Search() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const searchText = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="search-page">
      <div className="search-page-heading">
        <p className="section-label">SEARCH RESULTS</p>

        <h1>
          {searchText
            ? `Results for "${searchText}"`
            : "All Products"}
        </h1>
      </div>

      <div className="search-results">
        {filteredProducts.length === 0 ? (
          <p className="no-products">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="search-product-card"
              onClick={() =>
                navigate(`/products/${product.id}`)
              }
            >
              <div className="search-product-image">
                <img
                  src={productImages[product.id]}
                  alt={product.name}
                />
              </div>

              <div className="search-product-info">
                <p>{product.category}</p>

                <h2>{product.name}</h2>

                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;