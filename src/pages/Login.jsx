import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
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

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Invalid email or password"
        );
      }

      const loginResponse =
        await response.json();

      console.log(
        "Login response:",
        loginResponse
      );

      localStorage.setItem(
        "token",
        loginResponse.token
      );

      localStorage.setItem(
        "userName",
        loginResponse.name
      );

      setIsLoggedIn(true);

      navigate("/products");

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <div className="brand-icon">🛍️</div>

          <h1>My E-Commerce</h1>
        </div>

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

          <form onSubmit={handleLogin}>

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

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

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

          <div className="login-divider">
            <span>
              New to My E-Commerce?
            </span>
          </div>

          <Link
            to="/register"
            className="register-link"
          >
            Create an account
          </Link>

        </div>

        <p className="login-footer">
          © 2026 My E-Commerce. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Login;
