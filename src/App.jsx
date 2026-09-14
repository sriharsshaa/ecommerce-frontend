import { useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Cart from "./components/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact"; 
import Help from "./pages/Help"; 
import Returns from "./pages/Returns"; 
import Privacy from "./pages/Privacy"; 
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [cart, setCart] = useState([]);

  // Product filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");


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
          (product) => product.id === cartItem.productId
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
      console.error(
        "Checkout error:",
        error
      );
      alert("Checkout failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setCart([]);

    setSearch("");
    setCategory("All");
    setSortOrder("");

    alert("Logged out successfully!");
  }

  const cartCount = cart.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getCart();
    }
  }, []);

  return (
    <BrowserRouter>

      <AppContent

        cart={cart}
        cartCount={cartCount}

        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}

        search={search}
        setSearch={setSearch}

        category={category}
        setCategory={setCategory}

        sortOrder={sortOrder}
        setSortOrder={setSortOrder}

        addToCart={addToCart}

        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}

        checkout={checkout}

        handleLogout={handleLogout}

      />

        <Footer />
    </BrowserRouter>
  );
}


/* =========================================================
   APP CONTENT
========================================================= */

function AppContent({

  cart,
  cartCount,

  isLoggedIn,
  setIsLoggedIn,

  search,
  setSearch,

  category,
  setCategory,

  sortOrder,
  setSortOrder,

  addToCart,

  increaseQuantity,
  decreaseQuantity,
  removeFromCart,

  checkout,

  handleLogout,

}) {

  const navigate = useNavigate();


  return (
    <>

      <Navbar

        cartCount={cartCount}

        isLoggedIn={isLoggedIn}

        onLogout={handleLogout}

        search={search}
        setSearch={setSearch}

        category={category}
        setCategory={setCategory}

        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* SEARCH RESULTS */}
        <Route
          path="/search"
          element={<Search />}
        />

        {/* ALL PRODUCTS */}
        <Route
          path="/products"
          element={
            <Products
              addToCart={addToCart}
              search={search}
              category={category}
              sortOrder={sortOrder}
            />
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/products/:id"
          element={
            <ProductDetails
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

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <div className="checkout-section">

              <Cart
                cart={cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
              />

            </div>
          }
        />


        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Checkout

              cart={cart}

              onPlaceOrder={async (paymentMethod) => {

                try {

                  const token =
                    localStorage.getItem("token");


                  const response = await fetch(
                    `http://localhost:8080/api/orders?paymentMethod=${encodeURIComponent(
                      paymentMethod
                    )}`,
                    {
                      method: "POST",

                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );


                  if (!response.ok) {

                    const errorText =
                      await response.text();

                    console.error(
                      "Backend error:",
                      errorText
                    );

                    throw new Error(
                      errorText ||
                      "Failed to place order"
                    );
                  }


                  const order =
                    await response.json();


                  console.log(
                    "Order placed:",
                    order
                  );


                  window.location.href =
                    "/orders";

                } catch (error) {

                  console.error(
                    "Error placing order:",
                    error
                  );

                  alert(
                    "Failed to place order"
                  );

                }

              }}

            />
          }
        />


        {/* ORDERS */}
        <Route
          path="/orders"
          element={<Orders />}
        />

<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/help" element={<Help />} />
<Route path="/returns" element={<Returns />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/accessibility" element={<Accessibility />} />

      </Routes>

    </>
  );
}

export default App;