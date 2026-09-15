import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products({ addToWishlist }) {
  const [products, setProducts] = useState([]);

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
          <ProductCard
            key={product.id}
            product={product}
            addToWishlist={addToWishlist}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;
