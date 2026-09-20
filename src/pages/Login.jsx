import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn, showNotification }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Login failed
      if (!response.ok) {
        if (response.status === 401) {
          showNotification(
            "Invalid email or password. Please check your credentials.",
            "error"
          );

          return;
        }

        showNotification(
          "Unable to sign in right now. Please try again.",
          "error"
        );

        return;
      }

      // Login successful
      const loginResponse = await response.json();

      console.log("Login response:", loginResponse);

      // Store JWT token
      localStorage.setItem(
        "token",
        loginResponse.token
      );

      // Store username
      localStorage.setItem(
        "userName",
        loginResponse.name
      );

      // Update login state
      setIsLoggedIn(true);

      // -----------------------------------------
      // GET ROLE FROM JWT TOKEN
      // -----------------------------------------

      const tokenParts =
        loginResponse.token.split(".");

      const payload = JSON.parse(
        atob(tokenParts[1])
      );

      const role = payload.role;

      console.log("User role:", role);

      // -----------------------------------------
      // LOGIN SUCCESS MESSAGE
      // -----------------------------------------

      showNotification(
        "Login successful! Welcome back.",
        "success"
      );

      // -----------------------------------------
      // REDIRECT BASED ON ROLE
      // -----------------------------------------

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/products");
      }

    } catch (error) {
      console.error("Login error:", error);

      showNotification(
        "Unable to connect to the server. Please try again.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        {/* BRAND */}

        <div className="login-brand">

          <div className="brand-icon">
            🛍️
          </div>

          <h1>
            My E-Commerce
          </h1>

        </div>


        {/* LOGIN CARD */}

        <div className="login-card">

          <div className="login-header">
            <p className="login-label">
              WELCOME BACK
            </p>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your details to continue
              shopping.
            </p>
          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">
              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>


            {/* PASSWORD */}

            <div className="form-group">
              <label>
                Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>
            </div>


            {/* SIGN IN */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In →"}
            </button>

          </form>


          {/* DIVIDER */}

          <div className="login-divider">
            <span>
              New to My E-Commerce?
            </span>
          </div>


          {/* REGISTER */}

          <Link
            to="/register"
            className="register-link"
          >
            Create an account
          </Link>

        </div>


        {/* FOOTER */}

        <p className="login-footer">
          © 2026 My E-Commerce. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Login;