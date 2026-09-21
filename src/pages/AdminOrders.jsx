import { useEffect, useState } from "react";

function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores the status temporarily selected by admin
  const [selectedStatuses, setSelectedStatuses] =
    useState({});


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  async function fetchOrders() {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");


      const response =
        await fetch(
          "http://localhost:8080/api/admin/orders",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const responseText =
        await response.text();


      console.log(
        "Admin orders status:",
        response.status
      );


      console.log(
        "Admin orders response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Failed to fetch orders"
        );
      }


      const data =
        JSON.parse(responseText);


      setOrders(data);


    } catch (error) {

      console.error(
        "Admin orders error:",
        error
      );


      setError(
        error.message ||
        "Unable to load orders."
      );


    } finally {

      setLoading(false);
    }
  }


  useEffect(() => {

    fetchOrders();

  }, []);


  // =========================================================
  // STATUS DROPDOWN CHANGE
  // =========================================================

  function handleStatusChange(
    orderId,
    newStatus
  ) {

    setSelectedStatuses(
      (previous) => ({

        ...previous,

        [orderId]: newStatus,

      })
    );
  }


  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  async function updateOrderStatus(
    orderId,
    currentStatus
  ) {

    try {

      const token =
        localStorage.getItem("token");


      const selectedStatus =
        selectedStatuses[orderId] ||
        currentStatus;


      console.log(
        "Updating order:",
        orderId
      );


      console.log(
        "Current status:",
        currentStatus
      );


      console.log(
        "New status:",
        selectedStatus
      );


      const response =
        await fetch(
          `http://localhost:8080/api/admin/orders/${orderId}/status?status=${encodeURIComponent(
            selectedStatus
          )}`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      const responseText =
        await response.text();


      console.log(
        "Update status HTTP:",
        response.status
      );


      console.log(
        "Update status response:",
        responseText
      );


      if (!response.ok) {

        let message =
          "Unable to update order status.";


        try {

          const errorData =
            JSON.parse(responseText);


          message =
            errorData.message ||
            errorData.error ||
            responseText ||
            message;

        } catch {

          if (responseText) {

            message =
              responseText;
          }
        }


        throw new Error(message);
      }


      const updatedOrder =
        JSON.parse(responseText);


      // -----------------------------------------------------
      // Update order in frontend
      // -----------------------------------------------------

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) =>
              order.id ===
              updatedOrder.id
                ? updatedOrder
                : order
          )
      );


      // -----------------------------------------------------
      // Remove temporary dropdown value
      // -----------------------------------------------------

      setSelectedStatuses(
        (previous) => {

          const updated = {
            ...previous,
          };


          delete updated[orderId];


          return updated;
        }
      );


      alert(
        "Order status updated successfully!"
      );


    } catch (error) {

      console.error(
        "Update status error:",
        error
      );


      alert(
        error.message ||
        "Unable to update order status."
      );
    }
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>

          <br />

          <p className="admin-page-label">
            ADMIN PANEL
          </p>

          <h1>
            Orders
          </h1>

          <p>
            Manage customer orders and
            update their status.
          </p>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="admin-message">
          Loading orders...
        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading &&
        error && (

          <div className="admin-error">

            <strong>
              Unable to load orders
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>

        )}


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="admin-empty">

            <div className="admin-empty-icon">
              🛒
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              Customer orders will appear
              here once they place an order.
            </p>

          </div>

        )}


      {/* =====================================================
          ORDERS TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="admin-table-container">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => {

                  const selectedStatus =
                    selectedStatuses[
                      order.id
                    ] ||
                    order.status ||
                    "PLACED";


                  return (

                    <tr
                      key={order.id}
                    >


                      {/* =================================================
                          ORDER ID
                      ================================================= */}

                      <td>

                        #{order.id}

                      </td>


                      {/* =================================================
                          CUSTOMER
                      ================================================= */}

                      <td>

                        <div className="admin-customer">

                          <strong>

                            {order.userName ||
                              order.userEmail ||
                              "Customer"}

                          </strong>


                          {order.userEmail && (

                            <span>

                              {order.userEmail}

                            </span>

                          )}

                        </div>

                      </td>


                      {/* =================================================
                          AMOUNT
                      ================================================= */}

                      <td>

                        <strong>

                          ₹
                          {Number(
                            order.totalAmount ||
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td>

                        <div className="admin-status-control">


                          {/* =============================================
                              CANCELLED
                          ============================================= */}

                          {order.status ===
                          "CANCELLED" ? (

                            <span className="admin-cancelled-status">

                              CANCELLED

                            </span>

                          ) : (


                            /* ===========================================
                               NORMAL ORDER
                            =========================================== */

                            <>

                              <select
                                className="admin-status-select"
                                value={
                                  selectedStatus
                                }
                                onChange={(event) =>
                                  handleStatusChange(
                                    order.id,
                                    event.target.value
                                  )
                                }
                              >

                                <option
                                  value="PLACED"
                                  disabled
                                >
                                  Placed
                                </option>

                                <option
                                  value="CONFIRMED"
                                >
                                  Confirmed
                                </option>

                                <option
                                  value="SHIPPED"
                                >
                                  Shipped
                                </option>

                                <option
                                  value="DELIVERED"
                                >
                                  Delivered
                                </option>

                              </select>


                              <button
                                className="admin-status-button"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    selectedStatus
                                  )
                                }
                                disabled={
                                  selectedStatus ===
                                  order.status
                                }
                              >

                                Update

                              </button>

                            </>

                          )}

                        </div>

                      </td>


                      {/* =================================================
                          DATE
                      ================================================= */}

                      <td>

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

    </div>

  );
}

export default AdminOrders;