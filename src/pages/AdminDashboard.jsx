import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard({ showNotification }) {
  const navigate = useNavigate();

  // =========================================
  // DASHBOARD STATS
  // =========================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  // =========================================
  // ORDER STATUS COUNTS
  // =========================================

  const [orderStatusCounts, setOrderStatusCounts] =
    useState({
      PLACED: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    });

  // =========================================
  // REVENUE DATA
  // =========================================

  const [revenueData, setRevenueData] =
    useState([]);

  // =========================================
  // CATEGORY COUNTS
  // =========================================

  const [categoryCounts, setCategoryCounts] =
    useState({
      Electronics: 0,
      "Home & Kitchen": 0,
      Luggage: 0,
      "Men's Fashion": 0,
      "Women's Fashion": 0,
      Toys: 0,
      Books: 0,
      "Health & Household": 0,
    });

  // =========================================
  // RECENT ORDERS
  // =========================================

  const [recentOrders, setRecentOrders] =
    useState([]);

  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // TOTAL REVIEWS
  // =========================================

  const [totalReviews, setTotalReviews] =
    useState(0);

  // =========================================
  // TOTAL FEEDBACK
  // =========================================

  const [totalFeedback, setTotalFeedback] =
    useState(0);

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    fetchDashboard();
    fetchOrderStatusCounts();
    fetchRevenueData();
    fetchCategoryCounts();
    fetchRecentOrders();

    // =====================================
    // FETCH TOTAL REVIEWS
    // =====================================

    fetch(
      "http://localhost:8080/api/admin/reviews",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch reviews"
          );
        }

        return response.json();
      })
      .then((data) => {
        setTotalReviews(
          Array.isArray(data)
            ? data.length
            : 0
        );
      })
      .catch((error) => {
        console.error(
          "Fetch reviews error:",
          error
        );
      });

    // =====================================
    // FETCH TOTAL FEEDBACK
    // =====================================

    fetch(
      "http://localhost:8080/api/feedback",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch feedback"
          );
        }

        return response.json();
      })
      .then((data) => {
        setTotalFeedback(
          Array.isArray(data)
            ? data.length
            : 0
        );
      })
      .catch((error) => {
        console.error(
          "Fetch feedback error:",
          error
        );
      });
  }, []);

  // =========================================
  // FETCH DASHBOARD SUMMARY
  // =========================================

  async function fetchDashboard() {
    const token =
      localStorage.getItem("token");

    if (!token) {
      showNotification(
        "Please login as admin.",
        "error"
      );

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Please login again."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Access denied. Admin access required."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch dashboard data."
        );
      }

      const data =
        await response.json();

      setStats(data);
    } catch (error) {
      console.error(
        "Admin Dashboard error:",
        error
      );

      showNotification(
        error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // FETCH ORDER STATUS COUNTS
  // =========================================

  async function fetchOrderStatusCounts() {
    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const orders =
        await response.json();

      const counts = {
        PLACED: 0,
        CONFIRMED: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
      };

      if (Array.isArray(orders)) {
        orders.forEach((order) => {
          if (
            counts[order.status] !==
            undefined
          ) {
            counts[order.status]++;
          }
        });
      }

      setOrderStatusCounts(counts);
    } catch (error) {
      console.error(
        "Error fetching order status counts:",
        error
      );
    }
  }

  // =========================================
  // FETCH REVENUE DATA
  // =========================================

  async function fetchRevenueData() {
    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard/revenue",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch revenue"
        );
      }

      const data =
        await response.json();

      setRevenueData(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching revenue:",
        error
      );
    }
  }

  // =========================================
  // FETCH PRODUCT CATEGORY COUNTS
  // =========================================

  async function fetchCategoryCounts() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const products =
        await response.json();

      // Keep all new categories visible
      // even when the count is 0.

      const counts = {
        Electronics: 0,
        "Home & Kitchen": 0,
        Luggage: 0,
        "Men's Fashion": 0,
        "Women's Fashion": 0,
        Toys: 0,
        Books: 0,
        "Health & Household": 0,
      };

      if (Array.isArray(products)) {
        products.forEach((product) => {
          const category =
            product.category;

          if (
            counts[category] !==
            undefined
          ) {
            counts[category]++;
          }
        });
      }

      setCategoryCounts(counts);
    } catch (error) {
      console.error(
        "Error fetching category counts:",
        error
      );
    }
  }

  // =========================================
  // FETCH RECENT ORDERS
  // =========================================

  async function fetchRecentOrders() {
    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch recent orders"
        );
      }

      const orders =
        await response.json();

      const latestOrders =
        Array.isArray(orders)
          ? [...orders]
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ) -
                  new Date(
                    a.createdAt
                  )
              )
              .slice(0, 5)
          : [];

      setRecentOrders(
        latestOrders
      );
    } catch (error) {
      console.error(
        "Error fetching recent orders:",
        error
      );
    }
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>
          Admin Dashboard
        </h1>

        <p>
          Loading dashboard...
        </p>
      </div>
    );
  }

  // =========================================
  // STATUS MAX VALUE
  // =========================================

  const maxStatusCount =
    Math.max(
      ...Object.values(
        orderStatusCounts
      ),
      1
    );

  // =========================================
  // CATEGORY MAX VALUE
  // =========================================

  const maxCategoryCount =
    Math.max(
      ...Object.values(
        categoryCounts
      ),
      1
    );

  // =========================================
  // CATEGORY LIST
  // =========================================

  const categoryList = [
    ["Electronics", "Electronics"],
    ["Home & Kitchen", "Home & Kitchen"],
    ["Luggage", "Luggage"],
    ["Men's Fashion", "Men's Fashion"],
    ["Women's Fashion", "Women's Fashion"],
    ["Toys", "Toys"],
    ["Books", "Books"],
    [
      "Health & Household",
      "Health & Household",
    ],
  ];

  return (
    <div className="admin-dashboard">

      {/* =====================================
          DASHBOARD HEADER
      ===================================== */}

      <div className="admin-dashboard-header">

        <p className="section-label">
          ADMIN
        </p>

        <h1>
          Dashboard
        </h1>

        <p>
          Overview of users, products,
          orders and revenue.
        </p>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="admin-stats-grid">

        {/* TOTAL USERS */}

        <div
          className="admin-stat-card admin-stat-card-clickable"
          onClick={() =>
            navigate("/admin/users")
          }
        >
          <span className="admin-stat-icon">
            👥
          </span>

          <div>
            <p>
              Total Users
            </p>

            <h2>
              {stats.totalUsers}
            </h2>
          </div>
        </div>


        {/* TOTAL PRODUCTS */}

        <div
          className="admin-stat-card admin-stat-card-clickable"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          <span className="admin-stat-icon">
            📦
          </span>

          <div>
            <p>
              Total Products
            </p>

            <h2>
              {stats.totalProducts}
            </h2>
          </div>
        </div>


        {/* TOTAL ORDERS */}

        <div
          className="admin-stat-card admin-stat-card-clickable"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <span className="admin-stat-icon">
            🛒
          </span>

          <div>
            <p>
              Total Orders
            </p>

            <h2>
              {stats.totalOrders}
            </h2>
          </div>
        </div>


        {/* TOTAL REVIEWS */}

        <div
          className="admin-stat-card admin-stat-card-clickable"
          onClick={() =>
            navigate("/admin/reviews")
          }
        >
          <span className="admin-stat-icon">
            ★
          </span>

          <div>
            <p>
              Total Reviews
            </p>

            <h2>
              {totalReviews}
            </h2>
          </div>
        </div>


        {/* TOTAL FEEDBACK */}

        <div
          className="admin-stat-card admin-stat-card-clickable"
          onClick={() =>
            navigate("/admin/feedback")
          }
        >
          <span className="admin-stat-icon">
            💬
          </span>

          <div>
            <p>
              Total Feedback
            </p>

            <h2>
              {totalFeedback}
            </h2>
          </div>
        </div>

      </div>


      {/* =====================================
          TOTAL REVENUE
      ===================================== */}

      <div className="admin-revenue-card">

        <div className="admin-revenue-content">

          <div className="admin-revenue-icon">
            ₹
          </div>

          <div>

            <p className="admin-revenue-label">
              Total Revenue
            </p>

            <h2 className="admin-revenue-value">
              ₹
              {Number(
                stats.totalRevenue
              ).toLocaleString(
                "en-IN"
              )}
            </h2>

            <span className="admin-revenue-subtext">
              Overall revenue from orders
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          ORDERS + PRODUCTS
      ===================================== */}

      <div className="admin-dashboard-charts-row">

        {/* ===================================
            ORDERS BY STATUS
        =================================== */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <h2>
              Orders by Status
            </h2>

            <p>
              Current distribution of orders.
            </p>

          </div>


          <div className="order-status-chart">

            {[
              ["PLACED", "Placed"],
              ["CONFIRMED", "Confirmed"],
              ["SHIPPED", "Shipped"],
              ["DELIVERED", "Delivered"],
              ["CANCELLED", "Cancelled"],
            ].map(
              ([key, label]) => (
                <div
                  className="status-chart-row"
                  key={key}
                >

                  <div className="status-chart-label">

                    <span>
                      {label}
                    </span>

                    <strong>
                      {
                        orderStatusCounts[
                          key
                        ]
                      }
                    </strong>

                  </div>


                  <div className="status-chart-bar">

                    <div
                      className={`status-chart-fill ${key.toLowerCase()}`}
                      style={{
                        width: `${
                          (orderStatusCounts[
                            key
                          ] /
                            maxStatusCount) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>


        {/* ===================================
            PRODUCTS BY CATEGORY
        =================================== */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <h2>
              Products by Category
            </h2>

            <p>
              Products across your store
              categories.
            </p>

          </div>


          <div className="category-chart">

            {categoryList.map(
              ([key, label]) => {

                const count =
                  categoryCounts[
                    key
                  ] || 0;

                return (
                  <div
                    className="category-chart-row"
                    key={key}
                  >

                    <div className="category-chart-label">

                      <span>
                        {label}
                      </span>

                      <strong>
                        {count}
                      </strong>

                    </div>


                    <div className="category-chart-bar">

                      <div
                        className="category-chart-fill"
                        style={{
                          width: `${
                            (count /
                              maxCategoryCount) *
                            100
                          }%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>


      {/* =====================================
          REVENUE + RECENT ORDERS
      ===================================== */}

      <div className="admin-dashboard-bottom-row">

        {/* ===================================
            REVENUE OVER TIME
        =================================== */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <h2>
              Revenue Over Time
            </h2>

            <p>
              Daily revenue from
              non-cancelled orders.
            </p>

          </div>


          <div className="revenue-line-chart">

            {revenueData.length === 0 ? (
              <p className="no-revenue-data">
                No revenue data available.
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart
                  data={revenueData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />

                </LineChart>

              </ResponsiveContainer>
            )}

          </div>

        </div>


        {/* ===================================
            RECENT ORDERS
        =================================== */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <h2>
              Recent Orders
            </h2>

            <p>
              Latest orders placed by
              customers.
            </p>

          </div>


          <div className="recent-orders-list">

            {recentOrders.length === 0 ? (
              <p className="no-revenue-data">
                No recent orders available.
              </p>
            ) : (
              recentOrders.map(
                (order) => (
                  <div
                    className="recent-order-row"
                    key={order.id}
                  >

                    <div>

                      <strong>
                        Order #{order.id}
                      </strong>

                      <span>
                        {order.userName ||
                          "Customer"}
                      </span>

                    </div>


                    <strong>
                      ₹
                      {Number(
                        order.totalAmount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>


                    <span
                      className={`recent-order-status ${
                        (
                          order.status ||
                          ""
                        ).toLowerCase()
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;