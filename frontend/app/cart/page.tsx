"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useCartStore, useAuthStore } from "@/lib/store";

export default function CartPage() {
  const {
    items,
    loading,
    fetchCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    // If quantity becomes 0, remove the item with confirmation
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItemToRemove(itemId);
    setIsModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;

    try {
      await removeFromCart(itemToRemove);
      setIsModalOpen(false);
      setItemToRemove(null);
    } catch (error) {
      // Error handled in store
    }
  };

  const cancelRemove = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#121212] mb-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            Your Cart
          </h1>
          <p className="text-sm sm:text-base text-[#121212] opacity-60">
            Review your items before checkout
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 sm:py-32">
            <div
              className="inline-block bg-[#F7F7F5] px-8 sm:px-12 py-6 sm:py-8"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p className="text-xl sm:text-2xl text-[#121212] opacity-60 font-bold tracking-wide">
                LOADING...
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <div
              className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p
                className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3 sm:mb-4"
                style={{ letterSpacing: "-0.01em" }}
              >
                Your Cart is Empty
              </p>
              <p className="text-[#121212] opacity-50 text-base sm:text-lg mb-6">
                Start exploring our coffee collection
              </p>
              <Link
                href="/menu"
                className="inline-block bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                BROWSE MENU
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-6">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-[#F7F7F5] p-4 sm:p-6 flex gap-3 sm:gap-6"
                  style={{
                    borderRadius: "0px",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Product Image */}
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 bg-[#E9B60A] flex items-center justify-center flex-shrink-0"
                    style={{ borderRadius: "0px" }}
                  >
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: "4px" }}
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl">☕</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base sm:text-xl font-bold text-[#121212] mb-1 sm:mb-2"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#121212] opacity-70 font-medium mb-2 sm:mb-3">
                      ${item.price.toFixed(2)} each
                    </p>

                    {/* Display selected add-ons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="mb-2 sm:mb-4">
                        <p className="text-[9px] sm:text-xs font-bold text-[#121212] opacity-60 tracking-[0.1em] uppercase mb-1 sm:mb-2">
                          Add-ons:
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {item.selectedAddons.map((addon, idx) => (
                            <div
                              key={idx}
                              className="bg-[#E9B60A] px-2 py-0.5 sm:px-3 sm:py-1"
                              style={{ borderRadius: "0px" }}
                            >
                              <span className="text-[9px] sm:text-[10px] font-bold text-[#121212] tracking-[0.1em] uppercase">
                                {addon.name} (+${addon.price.toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#121212] hover:bg-opacity-80 hover:scale-110 text-[#F7F7F5] font-black text-base sm:text-lg transition-all duration-200 cursor-pointer"
                        style={{ borderRadius: "0px" }}
                      >
                        -
                      </button>
                      <span
                        className="w-10 h-8 sm:w-14 sm:h-10 flex items-center justify-center bg-[#EDECE8] font-black text-base sm:text-lg text-[#121212]"
                        style={{
                          letterSpacing: "-0.01em",
                          borderRadius: "0px",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#121212] hover:bg-opacity-80 hover:scale-110 text-[#F7F7F5] font-black text-base sm:text-lg transition-all duration-200 cursor-pointer"
                        style={{ borderRadius: "0px" }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total Price and Remove Button */}
                  <div className="flex flex-col items-end justify-between w-auto">
                    <div className="text-right">
                      <p className="text-[9px] sm:text-xs font-bold text-[#121212] opacity-40 tracking-[0.1em] uppercase mb-0.5 sm:mb-1">
                        Total
                      </p>
                      <p
                        className="text-lg sm:text-3xl font-black text-[#121212] mb-2 sm:mb-4"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        $
                        {(() => {
                          let total = item.price * item.quantity;
                          if (
                            item.selectedAddons &&
                            item.selectedAddons.length > 0
                          ) {
                            const addonsTotal = item.selectedAddons.reduce(
                              (sum, addon) => sum + addon.price,
                              0,
                            );
                            total += addonsTotal * item.quantity;
                          }
                          return total.toFixed(2);
                        })()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="bg-[#E97F8A] hover:bg-opacity-80 hover:scale-105 text-[#121212] px-3 py-1.5 sm:px-5 sm:py-2 font-bold text-[9px] sm:text-xs tracking-[0.08em] sm:tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer"
                      style={{ borderRadius: "0px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary - Sticky on large screens */}
            <div className="lg:col-span-1">
              <div
                className="bg-[#F7F7F5] p-5 sm:p-8 lg:sticky lg:top-8"
                style={{
                  borderRadius: "0px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  className="text-lg sm:text-2xl font-bold text-[#121212] mb-4 sm:mb-6"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                  <div className="flex justify-between items-center text-xs sm:text-base">
                    <span className="text-[#121212] opacity-60">Subtotal:</span>
                    <span className="font-bold text-[#121212]">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-base">
                    <span className="text-[#121212] opacity-60">Tax (8%):</span>
                    <span className="font-bold text-[#121212]">
                      ${(getCartTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t-2 border-[#121212] border-opacity-20 pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-lg sm:text-2xl font-bold text-[#121212]"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        Total:
                      </span>
                      <span
                        className="text-xl sm:text-3xl font-black text-[#121212]"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        ${(getCartTotal() * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-5 sm:px-8 py-3 sm:py-4 font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                  style={{ borderRadius: "0px" }}
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  );
}
