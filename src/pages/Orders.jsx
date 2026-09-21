import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchAddresses();
  }, []);

  async function fetchOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || "Failed to fetch orders"
        );
      }

      const data = responseText
        ? JSON.parse(responseText)
        : [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch orders error:", error);

      setError(
        error.message || "Unable to load your orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );
    }
  }

  async function fetchAddresses() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/addresses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Fetch addresses error:",
        error
      );
    }
  }

  async function fetchOrderItems(orderId) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return false;
    }

    if (orderItems[orderId]) {
      return true;
    }

    setItemsLoading((current) => ({
      ...current,
      [orderId]: true,
    }));

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/items`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
          "Failed to fetch order items"
        );
      }

      const items = responseText
        ? JSON.parse(responseText)
        : [];

      setOrderItems((current) => ({
        ...current,
        [orderId]: Array.isArray(items)
          ? items
          : [],
      }));

      return true;
    } catch (error) {
      console.error(
        "Order items error:",
        error
      );

      alert(
        error.message ||
        "Unable to load order items"
      );

      return false;
    } finally {
      setItemsLoading((current) => ({
        ...current,
        [orderId]: false,
      }));
    }
  }

  async function handleSelectOrder(orderId) {
    setSelectedOrderId(orderId);

    await fetchOrderItems(orderId);

    setTimeout(() => {
      const element =
        document.getElementById(
          "selected-order-details"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  function handleCloseDetails() {
    setSelectedOrderId(null);
  }

  async function cancelOrder(orderId) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
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

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
          "Failed to cancel order"
        );
      }

      const updatedOrder = responseText
        ? JSON.parse(responseText)
        : null;

      if (updatedOrder) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id
              ? updatedOrder
              : order
          )
        );
      }

      alert("Order cancelled successfully");
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error.message ||
        "Unable to cancel order"
      );
    }
  }

  function renderOrderStatus(status) {
    if (status === "CANCELLED") {
      return (
        <div className="order-status-timeline cancelled-order-timeline">
          <div className="status-step cancelled completed">
            <div className="status-icon">
              ✕
            </div>

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
                completed
                  ? "completed"
                  : ""
              }`}
              key={item}
            >
              <div className="status-icon">
                {completed
                  ? "✓"
                  : "○"}
              </div>

              <span>{item}</span>

              {index <
                statuses.length - 1 && (
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

  function formatDate(date) {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getStatusClass(status) {
    switch (status) {
      case "DELIVERED":
        return "status-delivered";

      case "SHIPPED":
        return "status-shipped";

      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-placed";
    }
  }

  function getProduct(productId) {
    return products.find(
      (product) =>
        Number(product.id) ===
        Number(productId)
    );
  }

  function getSelectedAddress(addressId) {
    if (!addressId) {
      return null;
    }

    return addresses.find(
      (address) =>
        Number(address.id) ===
        Number(addressId)
    );
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

  if (error) {
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

        <div className="empty-orders">
          <div className="empty-orders-icon">
            ⚠️
          </div>

          <h2>
            Unable to load orders
          </h2>

          <p>{error}</p>

          <button
            className="view-items-button"
            onClick={() => {
              setLoading(true);
              setError("");
              fetchOrders();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedOrder =
    orders.find(
      (order) =>
        order.id === selectedOrderId
    ) || null;

  const selectedItems =
    selectedOrder
      ? orderItems[selectedOrder.id] || []
      : [];

  const selectedAddress =
    selectedOrder
      ? getSelectedAddress(
          selectedOrder.addressId
        )
      : null;

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
        <>
          <div className="orders-grid">
            {orders.map((order) => {
              const isSelected =
                order.id ===
                selectedOrderId;

              return (
                <button
                  type="button"
                  className={`order-summary-card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  key={order.id}
                  onClick={() =>
                    handleSelectOrder(
                      order.id
                    )
                  }
                >
                  <div className="order-summary-top">
                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order.id}
                      </h2>
                    </div>

                    <span
                      className={`order-status-badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status ===
                      "CANCELLED"
                        ? "✕ CANCELLED"
                        : `✓ ${order.status}`}
                    </span>
                  </div>

                  <div className="order-summary-details">
                    <div>
                      <span>
                        Order Date
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Amount
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <span>
                      View Order
                    </span>

                    <span className="order-card-arrow">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOrder && (
            <div
              id="selected-order-details"
              className="selected-order-details"
            >
              <div className="selected-order-header">
                <div>
                  <p className="orders-label">
                    ORDER DETAILS
                  </p>

                  <h2>
                    Order #{selectedOrder.id}
                  </h2>

                  <p>
                    Placed on{" "}
                    {formatDate(
                      selectedOrder.createdAt
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="close-order-details"
                  onClick={
                    handleCloseDetails
                  }
                >
                  ✕ Close
                </button>
              </div>

              <div className="selected-order-info-grid">
                <div className="selected-order-info-card">
                  <span className="detail-label">
                    Order Status
                  </span>

                  <strong
                    className={`order-status-badge ${getStatusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status ===
                    "CANCELLED"
                      ? "✕ CANCELLED"
                      : `✓ ${selectedOrder.status}`}
                  </strong>
                </div>

                <div className="selected-order-info-card">
                  <span className="detail-label">
                    Payment
                  </span>

                  <strong>
                    {selectedOrder.paymentMethod ||
                      "N/A"}
                  </strong>
                </div>

                <div className="selected-order-info-card">
                  <span className="detail-label">
                    Total Amount
                  </span>

                  <strong className="selected-order-total">
                    ₹
                    {Number(
                      selectedOrder.totalAmount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

              <div className="selected-order-section">
                <div className="section-heading-row">
                  <h3>Order Tracking</h3>
                </div>

                {renderOrderStatus(
                  selectedOrder.status
                )}
              </div>

              {selectedAddress && (
                <div className="selected-order-section">
                  <div className="section-heading-row">
                    <h3>Delivery Address</h3>
                  </div>

                  <div className="order-address-box">
                    <strong>
                      {selectedAddress.fullName}
                    </strong>

                    <span>
                      {selectedAddress.phone}
                    </span>

                    <span>
                      {
                        selectedAddress.addressLine
                      }
                    </span>

                    <span>
                      {selectedAddress.city},{" "}
                      {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </span>
                  </div>
                </div>
              )}

              <div className="selected-order-section">
                <div className="section-heading-row">
                  <h3>Items in this Order</h3>

                  <span className="items-count">
                    {selectedItems.length}{" "}
                    {selectedItems.length ===
                    1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                {itemsLoading[
                  selectedOrder.id
                ] ? (
                  <div className="order-items-loading">
                    Loading order items...
                  </div>
                ) : selectedItems.length ===
                  0 ? (
                  <div className="order-items-empty">
                    No items found for this order.
                  </div>
                ) : (
                  <div className="order-items">
                    {selectedItems.map(
                      (item) => {
                        const product =
                          getProduct(
                            item.productId
                          );

                        if (!product) {
                          return (
                            <div
                              className="order-item"
                              key={item.id}
                            >
                              <div className="order-item-info">
                                <h4>
                                  Product unavailable
                                </h4>

                                <span>
                                  Product ID:{" "}
                                  {
                                    item.productId
                                  }
                                </span>

                                <span>
                                  Quantity:{" "}
                                  {
                                    item.quantity
                                  }
                                </span>
                              </div>
                            </div>
                          );
                        }

                        const imageUrl =
                          product.imageUrl
                            ? `http://localhost:8080${product.imageUrl}`
                            : null;

                        const itemTotal =
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.quantity || 0
                          );

                        return (
                          <div
                            className="order-item"
                            key={item.id}
                          >
                            <div className="order-item-image">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={
                                    product.name
                                  }
                                />
                              ) : (
                                <span>
                                  No Image
                                </span>
                              )}
                            </div>

                            <div className="order-item-info">
                              <span className="order-item-category">
                                {
                                  product.category
                                }
                              </span>

                              <h4>
                                {
                                  product.name
                                }
                              </h4>

                              <span className="order-item-quantity">
                                Quantity:{" "}
                                {
                                  item.quantity
                                }
                              </span>
                            </div>

                            <div className="order-item-price">
                              <strong>
                                ₹
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              <div className="selected-order-bottom">
                <div>
                  <span className="detail-label">
                    Order Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder.totalAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                {selectedOrder.status ===
                  "PLACED" && (
                  <button
                    type="button"
                    className="cancel-order-btn"
                    onClick={() =>
                      cancelOrder(
                        selectedOrder.id
                      )
                    }
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;