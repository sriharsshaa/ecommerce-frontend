import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="products-page">
      <div className="products-heading">
        <p className="section-label">SHOP</p>
        <h1>All Products</h1>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product.id}
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
            </div>

            <div className="product-card-info">
              <p>{product.category}</p>

              <h3>{product.name}</h3>

              <strong>
                ₹{product.price.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;