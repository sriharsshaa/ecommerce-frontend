import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function Search({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  // =========================================================
  // SEARCH PARAMETERS
  // =========================================================

  const searchText =
    searchParams.get("q") || "";

  const category =
    searchParams.get("category") || "All";

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

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

        const data =
          await response.json();

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

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts =
    products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productType =
        product.productType?.toLowerCase() || "";

      const searchValue =
        searchText.toLowerCase();

      const matchesSearch =
        productName.includes(searchValue) ||
        productType.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, category]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const productsPerPage = 10;

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  // =========================================================
  // CHANGE PAGE
  // =========================================================

  function goToPage(pageNumber) {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // ADD TO CART
  // =========================================================

  function handleAddToCart(
    event,
    product
  ) {
    // Prevent product details navigation
    event.stopPropagation();

    const stock =
      Number(product.stock || 0);

    if (stock === 0) {
      return;
    }

    addToCart(product.id);
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="search-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="search-page-heading">

        <p className="section-label">
          SEARCH RESULTS
        </p>

        <h1>
          {searchText
            ? `Results for "${searchText}"`
            : category !== "All"
            ? category
            : "All Products"}
        </h1>

      </div>


      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      <div className="search-results">

        {filteredProducts.length === 0 ? (
          <p className="no-products">
            No products found.
          </p>
        ) : (
          currentProducts.map(
            (product) => {

              // =================================================
              // IMAGE
              // =================================================

              const imageUrl =
                product.imageUrl
                  ? `http://localhost:8080${product.imageUrl}`
                  : null;

              // =================================================
              // STOCK
              // =================================================

              const stock =
                Number(product.stock || 0);

              const isOutOfStock =
                stock === 0;

              return (
                <div
                  key={product.id}
                  className="search-product-card"
                  onClick={() =>
                    navigate(
                      `/products/${product.id}`
                    )
                  }
                >

                  {/* ===========================================
                      PRODUCT IMAGE
                  =========================================== */}

                  <div className="search-product-image">

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


                  {/* ===========================================
                      PRODUCT INFORMATION
                  =========================================== */}

                  <div className="search-product-info">

                    {/* CATEGORY */}

                    <p className="search-product-category">
                      {product.category}
                    </p>


                    {/* PRODUCT TYPE */}

                    {product.productType && (
                      <p className="search-product-type">
                        {product.productType}
                      </p>
                    )}


                    {/* PRODUCT NAME */}

                    <h2>
                      {product.name}
                    </h2>


                    {/* PRICE */}

                    <strong>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>


                    {/* =======================================
                        STOCK
                    ======================================= */}

                    <p
                      className={
                        isOutOfStock
                          ? "search-stock out-of-stock"
                          : stock <= 5
                          ? "search-stock low-stock"
                          : "search-stock in-stock"
                      }
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : stock <= 5
                        ? `Only ${stock} left`
                        : "In Stock"}
                    </p>


                    {/* =======================================
                        ADD TO CART
                    ======================================= */}

                    <button
                      type="button"
                      className="search-add-cart-button"
                      disabled={
                        isOutOfStock
                      }
                      onClick={(event) =>
                        handleAddToCart(
                          event,
                          product
                        )
                      }
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>

                  </div>

                </div>
              );
            }
          )
        )}

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (
        <div className="admin-pagination">

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage - 1
              )
            }
            disabled={
              currentPage === 1
            }
          >
            ← Previous
          </button>


          {/* PAGE NUMBERS */}

          <div className="admin-pagination-pages">

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => {
                const pageNumber =
                  index + 1;

                return (
                  <button
                    type="button"
                    key={pageNumber}
                    className={
                      currentPage ===
                      pageNumber
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      goToPage(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

          </div>


          {/* NEXT */}

          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage + 1
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
          >
            Next →
          </button>

        </div>
      )}

    </div>
  );
}

export default Search;