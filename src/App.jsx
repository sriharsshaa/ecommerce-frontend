import { useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
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
import Notification from "./components/Notification";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [cart, setCart] = useState([]);

  // Product filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");


  // =========================================================
  // NOTIFICATION STATE
  // =========================================================

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });


  // =========================================================
  // SHOW NOTIFICATION
  // =========================================================

  function showNotification(
    message,
    type = "success"
  ) {

    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {

      setNotification({
        show: false,
        type: "success",
        message: "",
      });

    }, 3000);
  }


  // =========================================================
  // GET CART
  // =========================================================

  async function getCart() {

    const token =
      localStorage.getItem("token");

    if (!token) {

      setCart([]);

      return;
    }

    try {

      const cartResponse =
        await fetch(
          "http://localhost:8080/api/cart",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!cartResponse.ok) {

        throw new Error(
          "Failed to fetch cart"
        );
      }


      const cartData =
        await cartResponse.json();


      const productsResponse =
        await fetch(
          "http://localhost:8080/api/products"
        );


      if (!productsResponse.ok) {

        throw new Error(
          "Failed to fetch products"
        );
      }


      const productsData =
        await productsResponse.json();


      const updatedCart =
        cartData.map(
          (cartItem) => {

            const product =
              productsData.find(
                (product) =>
                  product.id ===
                  cartItem.productId
              );


            return {
              ...product,
              quantity:
                cartItem.quantity,
            };
          }
        );


      setCart(updatedCart);

    } catch (error) {

      console.error(
        "Get cart error:",
        error
      );
    }
  }


  // =========================================================
  // ADD TO CART
  // =========================================================

  async function addToCart(product) {

    const token =
      localStorage.getItem("token");


    if (!token) {

      showNotification(
        "Please login first.",
        "error"
      );

      return;
    }


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/cart/add?productId=${product.id}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to add product to cart"
        );
      }


      await getCart();


      showNotification(
        `${product.name} added to cart!`,
        "success"
      );

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      showNotification(
        "Failed to add product to cart.",
        "error"
      );
    }
  }


  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  async function increaseQuantity(
    productId
  ) {

    const token =
      localStorage.getItem("token");


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/cart/${productId}/increase`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to increase quantity"
        );
      }


      await getCart();

    } catch (error) {

      console.error(
        "Increase quantity error:",
        error
      );


      showNotification(
        "Failed to increase quantity.",
        "error"
      );
    }
  }


  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  async function decreaseQuantity(
    productId
  ) {

    const token =
      localStorage.getItem("token");


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/cart/${productId}/decrease`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to decrease quantity"
        );
      }


      await getCart();

    } catch (error) {

      console.error(
        "Decrease quantity error:",
        error
      );


      showNotification(
        "Failed to decrease quantity.",
        "error"
      );
    }
  }


  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  async function removeFromCart(
    productId
  ) {

    const token =
      localStorage.getItem("token");


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/cart/${productId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to remove product"
        );
      }


      await getCart();


      showNotification(
        "Product removed from cart.",
        "success"
      );

    } catch (error) {

      console.error(
        "Remove from cart error:",
        error
      );


      showNotification(
        "Failed to remove product.",
        "error"
      );
    }
  }


  // =========================================================
  // CHECKOUT
  // =========================================================

  async function checkout() {

    const token =
      localStorage.getItem("token");


    if (!token) {

      showNotification(
        "Please login first.",
        "error"
      );

      return;
    }


    if (cart.length === 0) {

      showNotification(
        "Your cart is empty.",
        "error"
      );

      return;
    }


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/orders",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Checkout failed"
        );
      }


      const order =
        await response.json();


      showNotification(
        `Order placed successfully! Order ID: ${order.id}`,
        "success"
      );


      await getCart();

    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );


      showNotification(
        "Checkout failed.",
        "error"
      );
    }
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {

    localStorage.removeItem("token");

    localStorage.removeItem("userName");


    setIsLoggedIn(false);

    setCart([]);


    setSearch("");

    setCategory("All");

    setSortOrder("");


    showNotification(
      "Logged out successfully!",
      "success"
    );
  }


  // =========================================================
  // CART COUNT
  // =========================================================

  const cartCount =
    cart.reduce(
      (sum, product) =>
        sum + product.quantity,
      0
    );


  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    if (token) {

      getCart();
    }

  }, []);


  return (
    <>

      {/* =====================================================
          GLOBAL NOTIFICATION
      ===================================================== */}

      <Notification
        type={notification.type}
        message={
          notification.show
            ? notification.message
            : ""
        }
        onClose={() =>
          setNotification({
            show: false,
            type: "success",
            message: "",
          })
        }
      />


      <BrowserRouter>

        <AppContent

          cart={cart}

          cartCount={cartCount}


          isLoggedIn={isLoggedIn}

          setIsLoggedIn={
            setIsLoggedIn
          }


          search={search}

          setSearch={setSearch}


          category={category}

          setCategory={setCategory}


          sortOrder={sortOrder}

          setSortOrder={setSortOrder}


          addToCart={addToCart}


          increaseQuantity={
            increaseQuantity
          }


          decreaseQuantity={
            decreaseQuantity
          }


          removeFromCart={
            removeFromCart
          }


          checkout={checkout}


          handleLogout={
            handleLogout
          }


          // IMPORTANT:
          // Pass notification function
          // to AppContent

          showNotification={
            showNotification
          }

        />

      </BrowserRouter>

    </>
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

  // IMPORTANT:
  // Receive notification function

  showNotification,

}) {

  const navigate = useNavigate();

  const location = useLocation();


  // =========================================================
  // HIDE FOOTER ON LOGIN AND REGISTER
  // =========================================================

  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (
    <>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

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


      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>


        {/* ===================================================
            HOME
        =================================================== */}

        <Route
          path="/"
          element={
            <Home />
          }
        />


        {/* ===================================================
            SEARCH RESULTS
        =================================================== */}

        <Route
          path="/search"
          element={
            <Search />
          }
        />


        {/* ===================================================
            ALL PRODUCTS
        =================================================== */}

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


        {/* ===================================================
            PRODUCT DETAILS
        =================================================== */}

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />


        {/* ===================================================
            LOGIN
        =================================================== */}

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={
                setIsLoggedIn
              }

              showNotification={
                showNotification
              }
            />
          }
        />


        {/* ===================================================
            REGISTER
        =================================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ===================================================
            CART
        =================================================== */}

        <Route
          path="/cart"
          element={
            <div className="checkout-section">

              <Cart

                cart={cart}

                increaseQuantity={
                  increaseQuantity
                }

                decreaseQuantity={
                  decreaseQuantity
                }

                removeFromCart={
                  removeFromCart
                }

              />

            </div>
          }
        />


        {/* ===================================================
            CHECKOUT
        =================================================== */}

        <Route
          path="/checkout"
          element={

            <Checkout

              cart={cart}

              onPlaceOrder={
                async (paymentMethod) => {

                  try {

                    const token =
                      localStorage.getItem(
                        "token"
                      );


                    if (!token) {

                      showNotification(
                        "Please login first.",
                        "error"
                      );

                      return;
                    }


                    const response =
                      await fetch(
                        `http://localhost:8080/api/orders?paymentMethod=${encodeURIComponent(
                          paymentMethod
                        )}`,
                        {
                          method: "POST",

                          headers: {
                            Authorization:
                              `Bearer ${token}`,
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


                    showNotification(
                      `Order placed successfully! Order ID: ${order.id}`,
                      "success"
                    );


                    window.location.href =
                      "/orders";


                  } catch (error) {

                    console.error(
                      "Error placing order:",
                      error
                    );


                    showNotification(
                      "Failed to place order.",
                      "error"
                    );

                  }

                }
              }

            />

          }
        />


        {/* ===================================================
            ORDERS
        =================================================== */}

        <Route
          path="/orders"
          element={
            <Orders />
          }
        />


        {/* ===================================================
            ABOUT
        =================================================== */}

        <Route
          path="/about"
          element={
            <About />
          }
        />


        {/* ===================================================
            CONTACT
        =================================================== */}

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />


        {/* ===================================================
            HELP
        =================================================== */}

        <Route
          path="/help"
          element={
            <Help />
          }
        />


        {/* ===================================================
            RETURNS
        =================================================== */}

        <Route
          path="/returns"
          element={
            <Returns />
          }
        />


        {/* ===================================================
            PRIVACY
        =================================================== */}

        <Route
          path="/privacy"
          element={
            <Privacy />
          }
        />


        {/* ===================================================
            TERMS
        =================================================== */}

        <Route
          path="/terms"
          element={
            <Terms />
          }
        />


        {/* ===================================================
            ACCESSIBILITY
        =================================================== */}

        <Route
          path="/accessibility"
          element={
            <Accessibility />
          }
        />

      </Routes>


      {/* =====================================================
          FOOTER

          Footer is hidden on:
          /login
          /register

          Footer appears on all other pages.
      ===================================================== */}

      {!hideFooter && <Footer />}

    </>
  );
}


export default App;
