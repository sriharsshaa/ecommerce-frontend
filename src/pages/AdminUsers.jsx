import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 15;


  // =========================================================
  // FETCH USERS
  // =========================================================

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch users"
        );
      }

      const data = await response.json();

      setUsers(data);

    } catch (error) {
      console.error(
        "Admin users error:",
        error
      );

      setError(
        "Unable to load users."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUsers();
  }, []);


  // =========================================================
  // ROLE CHANGE
  // =========================================================

  async function handleRoleChange(
    userId,
    newRole
  ) {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/role?role=${encodeURIComponent(
          newRole
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update role"
        );
      }

      const updatedUser =
        await response.json();

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        )
      );

    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      alert(
        "Unable to update user role."
      );
    }
  }


  // =========================================================
  // DELETE USER
  // =========================================================

  async function handleDeleteUser(
    userId,
    userName
  ) {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${userName}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to delete user"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== userId
        )
      );

      alert(
        "User deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert(
        "Unable to delete user."
      );
    }
  }


  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.ceil(
    users.length / usersPerPage
  );


  const startIndex =
    (currentPage - 1) *
    usersPerPage;


  const currentUsers =
    users.slice(
      startIndex,
      startIndex + usersPerPage
    );


  // =========================================================
  // CHANGE PAGE
  // =========================================================

  function goToPage(pageNumber) {

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="admin-page">

      {/* Header */}

      <div className="admin-page-header">

        <div>

          <p className="admin-page-label">
            ADMIN PANEL
          </p>

          <h1>
            Users
          </h1>

          <p>
            View registered customers and
            their account roles.
          </p>

        </div>

      </div>


      {/* Loading */}

      {loading && (
        <div className="admin-message">
          Loading users...
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* No Users */}

      {!loading &&
        !error &&
        users.length === 0 && (

          <div className="admin-empty">

            <div className="admin-empty-icon">
              👥
            </div>

            <h2>
              No Users Found
            </h2>

            <p>
              Registered users will appear
              here.
            </p>

          </div>

        )}


      {/* Users Table */}

      {!loading &&
        !error &&
        users.length > 0 && (

          <>

            <div className="admin-table-container">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      User ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                      >

                        <td>
                          #{user.id}
                        </td>


                        <td>

                          <strong>
                            {user.name}
                          </strong>

                        </td>


                        <td>
                          {user.email}
                        </td>


                        <td>

                          <select
                            value={user.role}
                            onChange={(event) =>
                              handleRoleChange(
                                user.id,
                                event.target.value
                              )
                            }
                            className={`user-role-select ${
                              user.role?.toLowerCase()
                            }`}
                          >

                            <option value="USER">
                              USER
                            </option>

                            <option value="ADMIN">
                              ADMIN
                            </option>

                          </select>

                        </td>


                        <td>

                          <button
                            className="admin-delete-user-btn"
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.name
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

              <div className="admin-pagination">

                {/* PREVIOUS */}

                <button
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                >
                  ← Previous
                </button>


                {/* PAGE NUMBERS */}

                <div className="admin-pagination-pages">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => {

                      const pageNumber =
                        index + 1;

                      return (

                        <button
                          key={pageNumber}
                          className={
                            currentPage ===
                            pageNumber
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            goToPage(
                              pageNumber
                            )
                          }
                        >
                          {pageNumber}
                        </button>

                      );

                    }
                  )}

                </div>


                {/* NEXT */}

                <button
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                >
                  Next →
                </button>

              </div>

            )}

          </>

        )}

    </div>
  );
}

export default AdminUsers;