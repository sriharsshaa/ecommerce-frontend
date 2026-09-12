import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Registration failed"
        );
      }

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
              CREATE ACCOUNT
            </p>

            <h2>Join us today</h2>

            <p>
              Create your account and start shopping.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

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
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
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
                ? "Creating account..."
                : "Create Account →"}
            </button>

          </form>

          <div className="login-divider">
            <span>Already have an account?</span>
          </div>

          <Link
            to="/login"
            className="register-link"
          >
            Sign in to your account
          </Link>

        </div>

        <p className="login-footer">
          © 2026 My E-Commerce. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Register;
