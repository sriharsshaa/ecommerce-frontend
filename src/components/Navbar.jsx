import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({
  cartCount,
  isLoggedIn,
  onLogout,
}) {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchText, setSearchText] = useState("");

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

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
    onLogout();

    setShowDropdown(false);

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
        <Link to="/">
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

            <Link to="/admin/dashboard">
              Dashboard
            </Link>


            {/* PRODUCTS */}

            <Link to="/admin/products">
              Products
            </Link>


            {/* ORDERS */}

            <Link to="/admin/orders">
              Orders
            </Link>


            {/* USERS */}

            <Link to="/admin/users">
              Users
            </Link>


            {/* FEEDBACKS */}

            <Link to="/admin/feedback">
              Feedback
            </Link>


            {/* REVIEWS */}

            <Link to="/admin/reviews">
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
                onClick={() =>
                  setShowCategories(
                    !showCategories
                  )
                }
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

            <Link to="/cart">
              Cart ({cartCount})
            </Link>


            {/* =================================
                WISHLIST
            ================================= */}

            <Link to="/wishlist">
              ♡ Wishlist
            </Link>


            {/* =================================
                ORDERS
            ================================= */}

            <Link to="/orders">
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
              onClick={() =>
                setShowDropdown(
                  !showDropdown
                )
              }
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

          <Link to="/login">
            Login
          </Link>

        )}

      </div>

    </nav>
  );
}

export default Navbar;