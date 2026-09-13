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

  function handleSearch(event) {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  function handleLogout() {
    onLogout();
    setShowDropdown(false);
    navigate("/login");
  }

  function handleCategory(category) {
    setShowCategories(false);

    if (category === "All") {
      navigate("/products");
      return;
    }

    navigate(`/search?category=${encodeURIComponent(category)}`);
  }

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo">
        <Link to="/">
          My E-Commerce
        </Link>
      </div>

      <div className="navbar-links">

        {/* ALL DROPDOWN */}
        <div className="all-menu">

          <button
            className="all-button"
            onClick={() =>
              setShowCategories(!showCategories)
            }
          >
            All ▾
          </button>

          {showCategories && (
            <div className="all-dropdown">

              <button onClick={() => handleCategory("All")}>
                All Products
              </button>

              <button onClick={() => handleCategory("Mobile")}>
                Mobile
              </button>

              <button onClick={() => handleCategory("Laptop")}>
                Laptop
              </button>

              <button onClick={() => handleCategory("Audio")}>
                Audio
              </button>

              <button onClick={() => handleCategory("Wearable")}>
                Wearables
              </button>

              <button onClick={() => handleCategory("Accessories")}>
                Accessories
              </button>

              <button onClick={() => handleCategory("Monitor")}>
                Monitors
              </button>

            </div>
          )}

        </div>

        {/* SEARCH */}
        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

          <button type="submit">
            🔍
          </button>
        </form>

        {/* CART */}
        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {/* ORDERS */}
        <Link to="/orders">
          Orders
        </Link>

        {/* PROFILE */}
        {isLoggedIn ? (
          <div className="profile-menu">

            <button
              className="profile-button"
              onClick={() =>
                setShowDropdown(!showDropdown)
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
                    Logged in
                  </span>
                </div>

                <button
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

