import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

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
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getOrderItems(orderId) {
    const token = localStorage.getItem("token");

    // If already open, close it
    if (orderItems[orderId]) {
      setOrderItems((current) => {
        const updated = { ...current };
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
        throw new Error("Failed to fetch order items");
      }

      const items = await response.json();

      setOrderItems((current) => ({
        ...current,
        [orderId]: items,
      }));
    } catch (error) {
      console.error("Order items error:", error);
    }
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">
        <div>
          <p className="orders-label">
            ORDER HISTORY
          </p>

          <h1>My Orders</h1>

          <p>
            Track and review your previous orders.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Your completed orders will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => {

            const items = orderItems[order.id];

            return (
              <div
                className="order-card"
                key={order.id}
              >

                {/* Order Header */}
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

                {/* Order Details */}
                <div className="order-details">

                  <div className="order-detail">
                    <span className="detail-label">
                      Order Date
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </strong>
                  </div>

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

                {/* View Items */}
                <div className="order-actions">

                  <button
                    className="view-items-button"
                    onClick={() =>
                      getOrderItems(order.id)
                    }
                  >
                    {items
                      ? "Hide Items ↑"
                      : "View Items →"}
                  </button>

                </div>

                {/* Order Items */}
                {items && (
                  <div className="order-items">

                    <h3>
                      Items in this order
                    </h3>

                    {items.map((item) => (
                      <div
                        className="order-item"
                        key={item.id}
                      >

                        <div className="order-item-info">
                          <strong>
                            Product #{item.productId}
                          </strong>

                          <span>
                            Quantity: {item.quantity}
                          </span>
                        </div>

                        <div className="order-item-price">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </div>

                      </div>
                    ))}

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
