import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({
  cartCount,
  isLoggedIn,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchText, setSearchText] = useState("");

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  // -----------------------------------------
  // CLOSE MENUS WHEN ROUTE CHANGES
  // -----------------------------------------

  useEffect(() => {
    setShowCategories(false);
    setShowDropdown(false);
  }, [location.pathname, location.search]);

  // -----------------------------------------
  // CLOSE ALL OPEN MENUS
  // -----------------------------------------

  function closeMenus() {
    setShowCategories(false);
    setShowDropdown(false);
  }

  // -----------------------------------------
  // GET ROLE FROM JWT
  // -----------------------------------------

  let userRole = "";

  if (token) {
    try {
      const tokenParts = token.split(".");

      const payload = JSON.parse(
        atob(tokenParts[1])
      );

      userRole = payload.role || "";
    } catch (error) {
      console.error(
        "Could not read user role:",
        error
      );
    }
  }

  const isAdmin = userRole === "ADMIN";

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  function handleSearch(event) {
    event.preventDefault();

    const value = searchText.trim();

    closeMenus();

    if (!value) {
      navigate("/search");
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(value)}`
    );
  }

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  function handleLogout() {
    closeMenus();

    onLogout();

    navigate("/login");
  }

  // -----------------------------------------
  // CATEGORY
  // -----------------------------------------

  function handleCategory(category) {
    setShowCategories(false);

    if (category === "All") {
      navigate("/products");
      return;
    }

    navigate(
      `/search?category=${encodeURIComponent(
        category
      )}`
    );
  }

  // -----------------------------------------
  // MY ADDRESSES
  // -----------------------------------------

  function handleAddresses() {
    setShowDropdown(false);
    navigate("/addresses");
  }

  return (
    <nav className="navbar">

      {/* =====================================
          LOGO
      ===================================== */}

      <div className="navbar-logo">
        <Link
          to="/"
          onClick={closeMenus}
        >
          My E-Commerce
        </Link>
      </div>

      <div className="navbar-links">

        {/* =====================================
            ADMIN NAVBAR
        ===================================== */}

        {isAdmin ? (
          <>

            {/* DASHBOARD */}

            <Link
              to="/admin/dashboard"
              onClick={closeMenus}
            >
              Dashboard
            </Link>

            {/* PRODUCTS */}

            <Link
              to="/admin/products"
              onClick={closeMenus}
            >
              Products
            </Link>

            {/* ORDERS */}

            <Link
              to="/admin/orders"
              onClick={closeMenus}
            >
              Orders
            </Link>

            {/* USERS */}

            <Link
              to="/admin/users"
              onClick={closeMenus}
            >
              Users
            </Link>

            {/* FEEDBACKS */}

            <Link
              to="/admin/feedback"
              onClick={closeMenus}
            >
              Feedback
            </Link>

            {/* REVIEWS */}

            <Link
              to="/admin/reviews"
              onClick={closeMenus}
            >
              Reviews
            </Link>

          </>
        ) : (

          /* ===================================
             CUSTOMER NAVBAR
          =================================== */

          <>

            {/* =================================
                ALL CATEGORIES DROPDOWN
            ================================= */}

            <div className="all-menu">

              <button
                type="button"
                className="all-button"
                onClick={() => {
                  setShowCategories(
                    (previous) => !previous
                  );

                  setShowDropdown(false);
                }}
              >
                All ▾
              </button>

              {showCategories && (

                <div className="all-dropdown">

                  {/* ALL PRODUCTS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory("All")
                    }
                  >
                    All Products
                  </button>

                  {/* ELECTRONICS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory("Electronics")
                    }
                  >
                    🔌 Electronics
                  </button>

                  {/* HOME & KITCHEN */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory(
                        "Home & Kitchen"
                      )
                    }
                  >
                    🏠 Home &amp; Kitchen
                  </button>

                  {/* LUGGAGE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory("Luggage")
                    }
                  >
                    🧳 Luggage
                  </button>

                  {/* MEN'S FASHION */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory(
                        "Men's Fashion"
                      )
                    }
                  >
                    👔 Men&apos;s Fashion
                  </button>

                  {/* WOMEN'S FASHION */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory(
                        "Women's Fashion"
                      )
                    }
                  >
                    👗 Women&apos;s Fashion
                  </button>

                  {/* TOYS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory("Toys")
                    }
                  >
                    🧸 Toys
                  </button>

                  {/* BOOKS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory("Books")
                    }
                  >
                    📚 Books
                  </button>

                  {/* HEALTH & HOUSEHOLD */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory(
                        "Health & Household"
                      )
                    }
                  >
                    🧴 Health &amp; Household
                  </button>

                </div>

              )}

            </div>

            {/* =================================
                SEARCH
            ================================= */}

            <form
              className="navbar-search"
              onSubmit={handleSearch}
            >

              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
              />

              <button type="submit">
                🔍
              </button>

            </form>

            {/* =================================
                CART
            ================================= */}

            <Link
              to="/cart"
              onClick={closeMenus}
            >
              Cart ({cartCount})
            </Link>

            {/* =================================
                WISHLIST
            ================================= */}

            <Link
              to="/wishlist"
              onClick={closeMenus}
            >
              ♡ Wishlist
            </Link>

            {/* =================================
                ORDERS
            ================================= */}

            <Link
              to="/orders"
              onClick={closeMenus}
            >
              Orders
            </Link>

          </>

        )}

        {/* =====================================
            PROFILE
        ===================================== */}

        {isLoggedIn ? (

          <div className="profile-menu">

            <button
              type="button"
              className="profile-button"
              onClick={() => {
                setShowDropdown(
                  (previous) => !previous
                );

                setShowCategories(false);
              }}
            >
              👤 {userName || "User"} ▾
            </button>

            {showDropdown && (

              <div className="profile-dropdown">

                <div className="profile-name">

                  <strong>
                    {userName || "User"}
                  </strong>

                  <span>
                    {isAdmin
                      ? "ADMIN"
                      : "Logged in"}
                  </span>

                </div>

                {/* MY ADDRESSES */}

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={handleAddresses}
                    className="dropdown-addresses"
                  >
                    📍 My Addresses
                  </button>
                )}

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-logout"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        ) : (

          <Link
            to="/login"
            onClick={closeMenus}
          >
            Login
          </Link>

        )}

      </div>

    </nav>
  );
}

export default Navbar;