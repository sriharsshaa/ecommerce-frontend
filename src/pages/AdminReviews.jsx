import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminReviews() {

  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState([]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 5;


  useEffect(() => {
    fetchReviews();
    fetchRatingData();
  }, []);


  // =========================================================
  // GET ALL CUSTOMER REVIEWS
  // =========================================================

  async function fetchReviews() {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:8080/api/admin/reviews",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch reviews"
        );
      }

      const data = await response.json();

      // Newest reviews first
      data.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setReviews(data);

    } catch (error) {

      console.error(
        "Fetch reviews error:",
        error
      );
    }
  }


  // =========================================================
  // GET PRODUCT-WISE RATING SUMMARY
  // =========================================================

  async function fetchRatingData() {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:8080/api/admin/reviews/ratings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch rating summary"
        );
      }

      const data = await response.json();

      setRatingData(data);

    } catch (error) {

      console.error(
        "Fetch rating summary error:",
        error
      );
    }
  }


  // =========================================================
  // RENDER STARS
  // =========================================================

  function renderStars(rating) {

    return (
      <span className="admin-review-stars">

        {[1, 2, 3, 4, 5].map(
          (star) => (

            <span key={star}>

              {star <= rating
                ? "★"
                : "☆"}

            </span>

          )
        )}

      </span>
    );
  }


  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(date) {

    if (!date) {
      return "Unknown date";
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


  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.ceil(
    reviews.length / reviewsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    reviewsPerPage;


  const currentReviews =
    reviews.slice(
      startIndex,
      startIndex + reviewsPerPage
    );


  // =========================================================
  // PAGE CHANGE
  // =========================================================

  function goToPage(pageNumber) {

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  return (

    <div className="admin-reviews-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-reviews-header">

        <p className="section-label">
          ADMIN
        </p>

        <h1>
          Reviews
        </h1>

        <p>
          Monitor customer reviews and
          product ratings.
        </p>

      </div>


      {/* =====================================================
          PRODUCT RATING OVERVIEW
      ===================================================== */}

      <section className="admin-rating-section">

        <div className="admin-section-heading">

          <div>

            <h2>
              Product Rating Overview
            </h2>

            <p>
              Average customer rating for
              each product.
            </p>

          </div>

        </div>


        {ratingData.length === 0 ? (

          <div className="admin-empty-state">

            No product ratings available yet.

          </div>

        ) : (

          <div className="admin-rating-chart">

            <ResponsiveContainer
              width="100%"
              height={Math.max(
                300,
                ratingData.length * 55
              )}
            >

              <BarChart
                data={ratingData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 30,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  domain={[0, 5]}
                  ticks={[
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                  ]}
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="productName"
                  width={150}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} / 5`,
                    "Average Rating",
                  ]}
                />

                <Bar
                  dataKey="averageRating"
                  name="Average Rating"
                  fill="#242934"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        )}

      </section>


      {/* =====================================================
          CUSTOMER REVIEWS
      ===================================================== */}

      <section className="admin-customer-reviews">

        <div className="admin-section-heading">

          <div>

            <h2>
              Customer Reviews
            </h2>

            <p>
              Recent feedback submitted by
              customers.
            </p>

          </div>

        </div>


        {reviews.length === 0 ? (

          <div className="admin-empty-state">

            No customer reviews yet.

          </div>

        ) : (

          <>

            {/* =================================================
                REVIEWS TABLE
            ================================================= */}

            <div className="admin-reviews-table-wrapper">

              <table className="admin-reviews-table">

                <thead>

                  <tr>

                    <th>#</th>

                    <th>
                      Product
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


                <tbody>

                  {currentReviews.map(
                    (review, index) => (

                      <tr
                        key={review.id}
                      >

                        {/* NUMBER */}

                        <td>
                          {startIndex +
                            index +
                            1}
                        </td>


                        {/* PRODUCT */}

                        <td>

                          <span className="admin-table-product">

                            {review.productName}

                          </span>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <strong>
                            {review.userName}
                          </strong>

                        </td>


                        {/* EMAIL */}

                        <td className="admin-table-email">

                          {review.userEmail}

                        </td>


                        {/* RATING */}

                        <td>

                          <div className="admin-table-rating">

                            {renderStars(
                              review.rating
                            )}

                            <span>
                              {review.rating}/5
                            </span>

                          </div>

                        </td>


                        {/* COMMENT */}

                        <td className="admin-table-comment">

                          {review.comment}

                        </td>


                        {/* DATE */}

                        <td className="admin-table-date">

                          {formatDate(
                            review.createdAt
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
                          key={
                            pageNumber
                          }
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

      </section>

    </div>
  );
}


export default AdminReviews;