import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Cart from "./components/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";

function App() {
  // =========================
  // AUTHENTICATION STATE
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // =========================
  // CART STATE
  // =========================

  const [cart, setCart] = useState([]);

  // =========================
  // GET CART
  // =========================

  async function getCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const cartResponse = await fetch(
        "http://localhost:8080/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await cartResponse.json();

      const productsResponse = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      const productsData = await productsResponse.json();

      const updatedCart = cartData.map((cartItem) => {
        const product = productsData.find(
          (product) =>
            product.id === cartItem.productId
        );

        return {
          ...product,
          quantity: cartItem.quantity,
        };
      });

      setCart(updatedCart);
    } catch (error) {
      console.error("Get cart error:", error);
    }
  }

  // =========================
  // ADD TO CART
  // =========================

  async function addToCart(product) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/add?productId=${product.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      await getCart();
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add product to cart");
    }
  }

  // =========================
  // INCREASE QUANTITY
  // =========================

  async function increaseQuantity(productId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${productId}/increase`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to increase quantity");
      }

      await getCart();
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );
    }
  }

  // =========================
  // DECREASE QUANTITY
  // =========================

  async function decreaseQuantity(productId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${productId}/decrease`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to decrease quantity");
      }

      await getCart();
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );
    }
  }

  // =========================
  // REMOVE FROM CART
  // =========================

  async function removeFromCart(productId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      await getCart();
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      );
    }
  }

  // =========================
  // CHECKOUT
  // =========================

  async function checkout() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const order = await response.json();

      alert(
        `Order placed successfully! Order ID: ${order.id}`
      );

      await getCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    }
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setCart([]);

    alert("Logged out successfully!");
  }

  // =========================
  // CART COUNT
  // =========================

  const cartCount = cart.reduce(
    (sum, product) =>
      sum + product.quantity,
    0
  );

  // =========================
  // LOAD CART WHEN APP STARTS
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getCart();
    }
  }, []);

  // =========================
  // UI
  // =========================

  return (
    <BrowserRouter>

      <Navbar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <Routes>

        {/* DEFAULT PAGE */}
        <Route
          path="/"
          element={
            <Navigate
              to="/products"
              replace
            />
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <Products
              addToCart={addToCart}
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <>
<div className="checkout-section">

  <Cart
    cart={cart}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
    removeFromCart={removeFromCart}
  />

  {cart.length > 0 && (
    <button
      className="checkout-button"
      onClick={checkout}
    >
      Proceed to Checkout →
    </button>
  )}

</div>
            </>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <Orders />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;