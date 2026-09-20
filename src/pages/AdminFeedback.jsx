import { useEffect, useState } from "react";

function AdminFeedback() {

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const feedbackPerPage = 10;


  // =========================================================
  // FETCH FEEDBACK
  // =========================================================

  useEffect(() => {
    fetchFeedback();
  }, []);


  async function fetchFeedback() {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:8080/api/feedback",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {
        throw new Error(
          "Failed to fetch feedback"
        );
      }


      const data = await response.json();


      // Newest feedback first
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );


      setFeedbackList(sortedData);

    } catch (error) {

      console.error(
        "Error fetching feedback:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  // =========================================================
  // RENDER STARS
  // =========================================================

  function renderStars(rating) {

    return (
      "★".repeat(rating) +
      "☆".repeat(5 - rating)
    );
  }


  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.ceil(
    feedbackList.length / feedbackPerPage
  );


  const startIndex =
    (currentPage - 1) *
    feedbackPerPage;


  const currentFeedback =
    feedbackList.slice(
      startIndex,
      startIndex + feedbackPerPage
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
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="admin-page">

        <h1>
          Feedback
        </h1>

        <p>
          Loading feedback...
        </p>

      </div>

    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <p className="section-label">
          ADMIN
        </p>

        <h1>
          Feedback
        </h1>

        <p>
          Review feedback submitted by
          customers.
        </p>

      </div>


      {/* =====================================================
          FEEDBACK TABLE
      ===================================================== */}

      {feedbackList.length === 0 ? (

        <div className="admin-empty-state">

          <h3>
            No feedback yet
          </h3>

          <p>
            Customer feedback will appear here.
          </p>

        </div>

      ) : (

        <>

          <div className="admin-feedback-table-wrapper">

            <table className="admin-feedback-table">


              {/* TABLE HEADER */}

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Comment
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody>

                {currentFeedback.map(
                  (feedback, index) => (

                    <tr
                      key={feedback.id}
                    >


                      {/* NUMBER */}

                      <td>
                        {startIndex + index + 1}
                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <strong>
                          {feedback.userName}
                        </strong>

                      </td>


                      {/* EMAIL */}

                      <td className="admin-feedback-table-email">

                        {feedback.userEmail}

                      </td>


                      {/* RATING */}

                      <td>

                        <div className="admin-feedback-table-rating">

                          <span className="admin-feedback-stars">

                            {renderStars(
                              feedback.rating
                            )}

                          </span>

                          <span>
                            {feedback.rating}/5
                          </span>

                        </div>

                      </td>


                      {/* COMMENT */}

                      <td className="admin-feedback-table-comment">

                        {feedback.comment}

                      </td>


                      {/* DATE */}

                      <td className="admin-feedback-table-date">

                        {new Date(
                          feedback.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

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

export default AdminFeedback;