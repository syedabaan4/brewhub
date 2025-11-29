"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: string;
  orderItemIndex: number;
  productId: string;
  productName: string;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  orderItemIndex,
  productId,
  productName,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/reviews", {
        order_id: orderId,
        order_item_index: orderItemIndex,
        product_id: productId,
        rating,
        comment: comment.trim() || null,
      });
      toast.success("Review submitted successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    onClose();
  };

  const renderStarButton = (star: number) => {
    const isActive = star <= (hoveredRating || rating);
    return (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className={`text-3xl sm:text-4xl transition-all duration-150 cursor-pointer ${
          isActive ? "text-[#E9B60A] scale-110" : "text-[#121212] opacity-20 hover:opacity-40"
        }`}
      >
        ★
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={handleClose}
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
                    Write Review
                  </span>
                </div>
              </div>
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F7F7F5] mb-1.5 sm:mb-2"
                style={{ letterSpacing: "-0.01em" }}
              >
                {productName}
              </h2>
              <p
                className="text-xs sm:text-sm text-[#F7F7F5] opacity-70"
                style={{ lineHeight: "1.6" }}
              >
                Share your experience with this drink
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[#F7F7F5] hover:text-[#E9B60A] transition-colors text-2xl sm:text-3xl leading-none font-bold flex-shrink-0"
              style={{ marginTop: "-4px" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          {/* Star Rating */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-[10px] sm:text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3 sm:mb-4">
              Your Rating *
            </label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map(renderStarButton)}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-bold text-[#121212] mt-3">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3 sm:mb-4">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Tell us what you thought about this drink..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212] text-sm placeholder-[#121212] placeholder-opacity-30 resize-none"
              style={{ borderRadius: "0px" }}
            />
            <p className="text-right text-[10px] sm:text-xs text-[#121212] opacity-40 mt-2">
              {comment.length}/500 characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6"
          style={{
            borderTop: "2px solid rgba(18,18,18,0.1)",
            boxShadow: "0px -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-[#121212] text-[#121212] font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: "0px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-[#121212] text-[#F7F7F5] font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ borderRadius: "0px" }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
