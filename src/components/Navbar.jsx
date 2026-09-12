import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({
  cartCount,
  isLoggedIn,
  onLogout,
}) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const userName = localStorage.getItem("userName");

  function handleLogout() {
    onLogout();
    setShowDropdown(false);
    navigate("/login");
  }

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <Link to="/products">
          My E-Commerce
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        <Link to="/orders">
          Orders
        </Link>

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
                  <span>Logged in</span>
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