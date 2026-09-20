import { useEffect, useState } from "react";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================================================
  // FETCH ORDERS + PRODUCTS
  // =========================================================

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  async function fetchOrders() {

    const token = localStorage.getItem("token");

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


      const data = await response.json();

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


      const data = await response.json();

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

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }


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


      const items = await response.json();


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
  // CANCEL ORDER
  // =========================================================

  const cancelOrder = async (orderId) => {

    const token = localStorage.getItem("token");


    if (!token) {
      alert("Please login first");
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message || "Failed to cancel order"
        );

      }


      const updatedOrder =
        await response.json();


      // Update only the cancelled order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );


      alert(
        "Order cancelled successfully"
      );

    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );


      alert(
        "Unable to cancel order"
      );
    }
  };


  // =========================================================
  // ORDER STATUS
  // =========================================================

function renderOrderStatus(status) {
  if (status === "CANCELLED") {
    return (
      <div className="order-status-timeline cancelled-order-timeline">
        <div className="status-step cancelled completed">
          <div className="status-icon">✕</div>
          <span>CANCELLED</span>
        </div>
      </div>
    );
  }

  const statuses = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
  ];

  const currentIndex =
    statuses.indexOf(status);

  return (
    <div className="order-status-timeline">
      {statuses.map((item, index) => {
        const completed =
          index <= currentIndex;

        return (
          <div
            className={`status-step ${
              completed ? "completed" : ""
            }`}
            key={item}
          >
            <div className="status-icon">
              {completed ? "✓" : "○"}
            </div>

            <span>{item}</span>

            {index < statuses.length - 1 && (
              <div
                className={`status-line ${
                  index < currentIndex
                    ? "completed"
                    : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
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


                  <div className="order-detail">

                    <span className="detail-label">
                      Order Date
                    </span>


                    <strong>

                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </strong>

                  </div>


                  <div className="order-detail">

                    <span className="detail-label">
                      Total Amount
                    </span>


                    <strong className="order-total">

                      ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>

                </div>


                {/* =================================================
                    ORDER STATUS TIMELINE
                ================================================= */}

                <div className="order-status-section">

                  <h3>
                    Order Status
                  </h3>


                  {renderOrderStatus(
                    order.status
                  )}

                </div>


                {/* =================================================
                    ORDER ACTIONS
                ================================================= */}

                <div className="order-actions">


                  {/* VIEW ITEMS */}

                  <button
                    className="view-items-button"
                    onClick={() =>
                      getOrderItems(
                        order.id
                      )
                    }
                  >

                    {items
                      ? "Hide Items ↑"
                      : "View Items →"}

                  </button>


                  {/* CANCEL ORDER */}

                  {order.status === "PLACED" && (

                    <button
                      className="cancel-order-btn"
                      onClick={() =>
                        cancelOrder(
                          order.id
                        )
                      }
                    >
                      Cancel Order
                    </button>

                  )}

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

                      const product =
                        products.find(
                          (product) =>
                            Number(
                              product.id
                            ) ===
                            Number(
                              item.productId
                            )
                        );


                      if (!product) {
                        return null;
                      }


                      // =================================================
                      // DYNAMIC PRODUCT IMAGE
                      // =================================================

                      const imageUrl =
                        product.imageUrl
                          ? `http://localhost:8080${product.imageUrl}`
                          : null;


                      return (

                        <div
                          className="order-item"
                          key={item.id}
                        >


                          {/* =================================================
                              PRODUCT IMAGE
                          ================================================= */}

                          <div className="order-item-image">

                            {imageUrl ? (

                              <img
                                src={imageUrl}
                                alt={product.name}
                              />

                            ) : (

                              <span>
                                No Image
                              </span>

                            )}

                          </div>


                          {/* =================================================
                              PRODUCT INFORMATION
                          ================================================= */}

                          <div className="order-item-info">

                            <span className="order-item-category">

                              {product.category}

                            </span>


                            <h4>

                              {product.name}

                            </h4>


                            <span className="order-item-quantity">

                              Quantity:{" "}
                              {item.quantity}

                            </span>

                          </div>


                          {/* =================================================
                              PRICE
                          ================================================= */}

                          <div className="order-item-price">

                            <span>

                              ₹
                              {(
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                )
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