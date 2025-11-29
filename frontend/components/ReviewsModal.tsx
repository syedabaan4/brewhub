"use client";

import { useState, useEffect } from "react";
import { Product, Review, ReviewsResponse } from "@/types";
import api from "@/lib/api";

interface ReviewsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewsModal({
  product,
  isOpen,
  onClose,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchReviews(1);
    }
  }, [isOpen, product.id]);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get<ReviewsResponse>(
        `/products/${product.id}/reviews?per_page=20&page=${page}`
      );
      setReviews(response.data.reviews);
      setAverageRating(response.data.average_rating);
      setTotalReviews(response.data.total_reviews);
      setCurrentPage(response.data.pagination.current_page);
      setLastPage(response.data.pagination.last_page);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const sizeClasses = size === "lg" ? "text-xl sm:text-2xl" : "text-sm";
    return (
      <div className={`flex gap-0.5 ${sizeClasses}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-[#E9B60A]" : "text-[#121212] opacity-20"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-[#F7F7F5] w-full max-w-[85vw] sm:max-w-md lg:max-w-lg max-h-[80vh] sm:max-h-[85vh] overflow-hidden flex flex-col z-10"
        style={{
          borderRadius: "0px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="bg-[#121212] px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6"
          style={{ borderBottom: "2px solid rgba(247,247,245,0.1)" }}
        >
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="inline-block mb-2 sm:mb-3">
                <div className="bg-[#E9B60A] px-3 sm:px-4 py-1 sm:py-1.5">
                  <span className="text-[#121212] font-bold text-[9px] sm:text-[10px] tracking-[0.15em] uppercase">
                    Reviews
                  </span>
                </div>
              </div>
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F7F7F5] mb-1.5 sm:mb-2"
                style={{ letterSpacing: "-0.01em" }}
              >
                {product.name}
              </h2>

              {/* Rating Summary */}
              {!loading && (
                <div className="flex items-center gap-3 mt-3">
                  {averageRating !== null ? (
                    <>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(averageRating), "lg")}
                        <span
                          className="text-xl sm:text-2xl font-black text-[#E9B60A]"
                          style={{ letterSpacing: "-0.02em" }}
                        >
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-[#F7F7F5] opacity-50">
                        ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm text-[#F7F7F5] opacity-50">
                      No reviews yet
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#F7F7F5] hover:text-[#E9B60A] transition-colors text-2xl sm:text-3xl leading-none font-bold flex-shrink-0"
              style={{ marginTop: "-4px" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[#121212] opacity-60 font-bold tracking-wide">
                LOADING...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4 opacity-30">☕</div>
              <p className="text-lg font-bold text-[#121212] mb-2">
                No Reviews Yet
              </p>
              <p className="text-sm text-[#121212] opacity-50">
                Be the first to review this drink!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id || review._id}
                  className="bg-white p-4 sm:p-5"
                  style={{
                    borderRadius: "0px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm sm:text-base text-[#121212] truncate">
                        {review.user_name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#121212] opacity-50">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <p
                      className="text-sm text-[#121212] opacity-80"
                      style={{ lineHeight: "1.6" }}
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && lastPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t-2 border-[#121212] border-opacity-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 font-bold text-xs tracking-[0.1em] uppercase transition-all ${
                  currentPage === 1
                    ? "text-[#121212] opacity-30 cursor-not-allowed"
                    : "text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                ← Prev
              </button>
              <span className="text-xs font-bold text-[#121212] opacity-50 px-3">
                {currentPage} / {lastPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className={`px-3 py-2 font-bold text-xs tracking-[0.1em] uppercase transition-all ${
                  currentPage === lastPage
                    ? "text-[#121212] opacity-30 cursor-not-allowed"
                    : "text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5"
          style={{
            borderTop: "2px solid rgba(18,18,18,0.1)",
            boxShadow: "0px -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-[#121212] text-[#121212] font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer"
            style={{ borderRadius: "0px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
