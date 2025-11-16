"use client";

import { useState } from "react";
import { Product, AddOn } from "@/types";

interface AddOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (selectedAddons: AddOn[], quantity: number) => void;
}

export default function AddOnModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: AddOnModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddonToggle = (addon: AddOn) => {
    if (!addon.available) return;

    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isAddonSelected = (addon: AddOn) => {
    return selectedAddons.some((a) => a.name === addon.name);
  };

  const calculateTotal = () => {
    const basePrice = product.price * quantity;
    const addonsPrice =
      selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * quantity;
    return basePrice + addonsPrice;
  };

  const handleAddToCart = () => {
    onAddToCart(selectedAddons, quantity);
    setSelectedAddons([]);
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    setSelectedAddons([]);
    setQuantity(1);
    onClose();
  };

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
                    Customize
                  </span>
                </div>
              </div>
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F7F7F5] mb-1.5 sm:mb-2"
                style={{ letterSpacing: "-0.01em" }}
              >
                {product.name}
              </h2>
              <p
                className="text-xs sm:text-sm text-[#F7F7F5] opacity-70 mb-2 sm:mb-3 line-clamp-2"
                style={{ lineHeight: "1.6" }}
              >
                {product.description}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-[#F7F7F5] opacity-50 tracking-[0.1em] uppercase">
                  Base Price
                </span>
                <span
                  className="text-xl sm:text-2xl font-black text-[#E9B60A]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          {/* Quantity Selector */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-[10px] sm:text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3 sm:mb-4">
              Quantity
            </label>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#121212] text-[#121212] font-black text-lg sm:text-xl hover:bg-[#121212] hover:text-[#F7F7F5] transition-all cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                −
              </button>
              <span
                className="text-2xl sm:text-3xl font-black text-[#121212] w-12 sm:w-16 text-center"
                style={{ letterSpacing: "-0.02em" }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#121212] text-[#121212] font-black text-lg sm:text-xl hover:bg-[#121212] hover:text-[#F7F7F5] transition-all cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3 sm:mb-4">
                Add-Ons
              </label>
              <div className="space-y-2 sm:space-y-3">
                {product.addons.map((addon, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddonToggle(addon)}
                    disabled={!addon.available}
                    className={`w-full flex justify-between items-center p-3 sm:p-4 border-2 transition-all ${
                      !addon.available
                        ? "border-[#121212] border-opacity-10 bg-[#EDECE8] cursor-not-allowed opacity-50"
                        : isAddonSelected(addon)
                          ? "border-[#121212] bg-[#121212]"
                          : "border-[#121212] border-opacity-20 bg-white hover:border-[#121212] hover:border-opacity-40 cursor-pointer"
                    }`}
                    style={{ borderRadius: "0px" }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 border-2 flex items-center justify-center flex-shrink-0 ${
                          !addon.available
                            ? "border-[#121212] border-opacity-20"
                            : isAddonSelected(addon)
                              ? "border-[#E9B60A] bg-[#E9B60A]"
                              : "border-[#121212] border-opacity-40"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {isAddonSelected(addon) && (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-[#121212]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`font-bold text-xs sm:text-sm truncate ${
                          !addon.available
                            ? "text-[#121212] opacity-40"
                            : isAddonSelected(addon)
                              ? "text-[#F7F7F5]"
                              : "text-[#121212]"
                        }`}
                      >
                        {addon.name}
                        {!addon.available && " (N/A)"}
                      </span>
                    </div>
                    <span
                      className={`font-black text-base sm:text-lg flex-shrink-0 ml-2 ${
                        !addon.available
                          ? "text-[#121212] opacity-30"
                          : isAddonSelected(addon)
                            ? "text-[#E9B60A]"
                            : "text-[#121212]"
                      }`}
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      +${addon.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6"
          style={{
            borderTop: "2px solid rgba(18,18,18,0.1)",
            boxShadow: "0px -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Total */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-[#121212] opacity-40 tracking-[0.1em] uppercase mb-1">
                Total
              </div>
              <div
                className="text-3xl sm:text-4xl font-black text-[#121212]"
                style={{ letterSpacing: "-0.02em" }}
              >
                ${calculateTotal().toFixed(2)}
              </div>
            </div>
            {selectedAddons.length > 0 && (
              <div className="text-right">
                <div className="text-[10px] sm:text-xs font-bold text-[#121212] opacity-40 tracking-[0.1em] uppercase mb-1">
                  Add-ons
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#121212] opacity-60">
                  {selectedAddons.length} selected
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-[#121212] text-[#121212] font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-[#121212] text-[#F7F7F5] font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
