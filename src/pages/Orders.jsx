import { useEffect, useState } from "react";


function Orders() {

  const [orders, setOrders] = useState([]);

  const [orderItems, setOrderItems] = useState({});

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  // Product image mapping

  const productImages = {

    1: "/images/iphone15.png",

    2: "/images/dell-laptop.png",

    3: "/images/sony_headphones.png",

    4: "/images/samsung_galaxy_s24.png",

    5: "/images/hp_pavilion.png",

    6: "/images/jbl_bluetooth_speaker.png",

    7: "/images/apple_watch_series_9.png",

    8: "/images/logitech_mouse.png",

    9: "/images/samsung_27inch_monitor.png",

  };


  useEffect(() => {

    fetchOrders();

    fetchProducts();

  }, []);


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  async function fetchOrders() {

    const token =
      localStorage.getItem("token");


    if (!token) {

      setLoading(false);

      return;

    }


    try {

      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch orders"
        );

      }


      const data =
        await response.json();


      setOrders(data);


    } catch (error) {

      console.error(
        "Fetch orders error:",
        error
      );


    } finally {

      setLoading(false);

    }

  }


  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  async function fetchProducts() {

    try {

      const response = await fetch(
        "http://localhost:8080/api/products"
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch products"
        );

      }


      const data =
        await response.json();


      setProducts(data);


    } catch (error) {

      console.error(
        "Fetch products error:",
        error
      );

    }

  }


  // =========================================================
  // FETCH ORDER ITEMS
  // =========================================================

  async function getOrderItems(orderId) {

    const token =
      localStorage.getItem("token");


    // If already open, close it

    if (orderItems[orderId]) {

      setOrderItems((current) => {

        const updated = {
          ...current,
        };


        delete updated[orderId];


        return updated;

      });


      return;

    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch order items"
        );

      }


      const items =
        await response.json();


      setOrderItems((current) => ({

        ...current,

        [orderId]: items,

      }));


    } catch (error) {

      console.error(
        "Order items error:",
        error
      );

    }

  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="orders-page">

        <div className="orders-loading">

          Loading your orders...

        </div>

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="orders-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="orders-header">

        <div>

          <p className="orders-label">

            ORDER HISTORY

          </p>


          <h1>

            My Orders

          </h1>


          <p>

            Track and review your previous orders.

          </p>

        </div>

      </div>


      {/* =====================================================
          NO ORDERS
      ===================================================== */}

      {orders.length === 0 ? (

        <div className="empty-orders">

          <div className="empty-orders-icon">

            📦

          </div>


          <h2>

            No orders yet

          </h2>


          <p>

            Your completed orders will appear here.

          </p>

        </div>

      ) : (


        /* ===================================================
           ORDERS LIST
        =================================================== */

        <div className="orders-list">


          {orders.map((order) => {


            const items =
              orderItems[order.id];


            return (

              <div
                className="order-card"
                key={order.id}
              >


                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="order-card-header">


                  <div>

                    <p className="order-label">

                      ORDER

                    </p>


                    <h2>

                      #{order.id}

                    </h2>

                  </div>


                  <span className="order-status">

                    ✓ {order.status}

                  </span>


                </div>


                {/* =================================================
                    ORDER DETAILS
                ================================================= */}

                <div className="order-details">


                  {/* Order Date */}

                  <div className="order-detail">

                    <span className="detail-label">

                      Order Date

                    </span>


                    <strong>

                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}

                    </strong>

                  </div>


                  {/* Total Amount */}

                  <div className="order-detail">

                    <span className="detail-label">

                      Total Amount

                    </span>


                    <strong className="order-total">

                      ₹
                      {order.totalAmount.toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>


                </div>


                {/* =================================================
                    VIEW ITEMS BUTTON
                ================================================= */}

                <div className="order-actions">


                  <button
                    className="view-items-button"
                    onClick={() =>
                      getOrderItems(order.id)
                    }
                  >

                    {items

                      ? "Hide Items ↑"

                      : "View Items →"

                    }

                  </button>


                </div>


                {/* =================================================
                    ORDER ITEMS
                ================================================= */}

                {items && (

                  <div className="order-items">


                    <h3>

                      Items in this order

                    </h3>


                    {items.map((item) => {


                      // Find product information

                      const product =
                        products.find(
                          (product) =>
                            product.id ===
                            item.productId
                        );


                      // Product not found

                      if (!product) {

                        return null;

                      }


                      return (

                        <div
                          className="order-item"
                          key={item.id}
                        >


                          {/* =====================================
                              PRODUCT IMAGE
                          ===================================== */}

                          <div className="order-item-image">

                            <img
                              src={
                                productImages[
                                  product.id
                                ]
                              }
                              alt={product.name}
                            />

                          </div>


                          {/* =====================================
                              PRODUCT INFORMATION
                          ===================================== */}

                          <div className="order-item-info">


                            <span className="order-item-category">

                              {product.category}

                            </span>


                            <h4>

                              {product.name}

                            </h4>


                            <span className="order-item-quantity">

                              Quantity: {item.quantity}

                            </span>


                          </div>


                          {/* =====================================
                              PRICE
                          ===================================== */}

                          <div className="order-item-price">

                            <span>

                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </span>

                          </div>


                        </div>

                      );

                    })}


                  </div>

                )}


              </div>

            );

          })}


        </div>

      )}


    </div>

  );

}


export default Orders;
