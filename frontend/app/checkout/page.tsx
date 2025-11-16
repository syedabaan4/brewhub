"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCartStore, useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // Prefill contact information from user account
    if (user?.name) {
      setCustomerName(user.name);
    }
    if (user?.email) {
      setCustomerEmail(user.email);
    }
    if (user?.phone) {
      setCustomerPhone(user.phone);
    }
  }, [isAuthenticated, user, router]);

  const handlePlaceOrder = async () => {
    // Validation
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!customerEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (
      !phoneRegex.test(customerPhone) ||
      customerPhone.replace(/\D/g, "").length < 10
    ) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const response = await api.post("/orders", {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          selected_addons: item.selectedAddons || [],
        })),
        total_price: getCartTotal(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_status: "paid", // Mock payment
      });

      setOrderNumber(response.data.order_number);
      setCompletedOrder(response.data);
      await clearCart();
      setOrderCompleted(true);
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (orderCompleted && completedOrder) {
    return (
      <div className="min-h-screen bg-[#EDECE8]">
        <Navbar />

        <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 lg:p-12"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* Success Header */}
            <div className="text-center mb-10">
              <div className="text-6xl sm:text-7xl mb-6">✅</div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#121212] mb-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                Order Confirmed!
              </h1>
              <p className="text-sm sm:text-base text-[#121212] opacity-60">
                Thank you for your order. Your coffee is being prepared!
              </p>
            </div>

            {/* Order Number Badge */}
            <div
              className="bg-[#E9B60A] p-4 sm:p-6 mb-8"
              style={{ borderRadius: "0px" }}
            >
              <div className="text-center">
                <p className="text-[10px] sm:text-xs font-bold text-[#121212] opacity-60 tracking-[0.15em] uppercase mb-2">
                  Order Number
                </p>
                <p
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-[#121212] break-all"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {orderNumber}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <h2
                className="text-xl sm:text-2xl font-bold text-[#121212] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Order Summary
              </h2>
              <div className="space-y-4">
                {completedOrder.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-[#121212] mb-1">
                        {item.product_name || "Item"}
                      </p>
                      <p className="text-xs sm:text-sm text-[#121212] opacity-50">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      {item.selected_addons &&
                        item.selected_addons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.selected_addons.map(
                              (addon: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-[#E9B60A] px-3 py-1"
                                  style={{ borderRadius: "0px" }}
                                >
                                  <span className="text-[10px] font-bold text-[#121212] tracking-[0.1em] uppercase">
                                    {addon.name} (+${addon.price.toFixed(2)})
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                    <p className="text-base sm:text-lg font-bold text-[#121212]">
                      $
                      {(() => {
                        let total = item.price * item.quantity;
                        if (
                          item.selected_addons &&
                          item.selected_addons.length > 0
                        ) {
                          const addonsTotal = item.selected_addons.reduce(
                            (sum: number, addon: any) => sum + addon.price,
                            0,
                          );
                          total += addonsTotal * item.quantity;
                        }
                        return total.toFixed(2);
                      })()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base mb-4">
                <span className="text-[#121212] opacity-60">Subtotal:</span>
                <span className="font-bold text-[#121212]">
                  ${completedOrder.total_price.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-[#121212] opacity-60">Tax (8%):</span>
                <span className="font-bold text-[#121212]">
                  ${(completedOrder.total_price * 0.08).toFixed(2)}
                </span>
              </div>

              <div className="border-t-2 border-[#121212] border-opacity-20 mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span
                    className="text-xl sm:text-2xl font-bold text-[#121212]"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    Total:
                  </span>
                  <span
                    className="text-2xl sm:text-3xl font-black text-[#121212]"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    ${(completedOrder.total_price * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="bg-white border-2 border-[#121212] border-opacity-10 p-5 sm:p-6 mb-8"
              style={{ borderRadius: "0px" }}
            >
              <h3 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-4">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-[#121212] opacity-50 font-medium">
                    Name:
                  </span>
                  <span className="text-[#121212] font-semibold">
                    {completedOrder.customer_name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#121212] opacity-50 font-medium">
                    Email:
                  </span>
                  <span className="text-[#121212] font-semibold">
                    {completedOrder.customer_email}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#121212] opacity-50 font-medium">
                    Phone:
                  </span>
                  <span className="text-[#121212] font-semibold">
                    {completedOrder.customer_phone}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t-2 border-[#121212] border-opacity-10 space-y-2">
                <p className="text-xs sm:text-sm text-[#121212] opacity-70">
                  📧 A confirmation email has been sent to{" "}
                  {completedOrder.customer_email}
                </p>
                <p className="text-xs sm:text-sm text-[#121212] opacity-70">
                  🏪 This is a pickup order. We'll contact you when it's ready!
                </p>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <button
              onClick={() => router.push("/menu")}
              className="w-full bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#121212] mb-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-[#121212] opacity-60">
            Review your order and complete your purchase
          </p>
        </div>

        {items.length === 0 ? (
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
              <button
                onClick={() => router.push("/menu")}
                className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                BROWSE MENU
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <h2
                className="text-xl sm:text-2xl font-bold text-[#121212] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Order Summary
              </h2>
              <div
                className="bg-[#F7F7F5] p-6 sm:p-8"
                style={{
                  borderRadius: "0px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div className="space-y-5 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-semibold text-[#121212] mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs sm:text-sm text-[#121212] opacity-50">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        {item.selectedAddons &&
                          item.selectedAddons.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.selectedAddons.map((addon, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#E9B60A] px-3 py-1"
                                  style={{ borderRadius: "0px" }}
                                >
                                  <span className="text-[10px] font-bold text-[#121212] tracking-[0.1em] uppercase">
                                    {addon.name} (+${addon.price.toFixed(2)})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <p className="text-base sm:text-lg font-bold text-[#121212]">
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
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base mb-4">
                  <span className="text-[#121212] opacity-60">Subtotal:</span>
                  <span className="font-bold text-[#121212]">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-[#121212] opacity-60">Tax (8%):</span>
                  <span className="font-bold text-[#121212]">
                    ${(getCartTotal() * 0.08).toFixed(2)}
                  </span>
                </div>

                <div className="border-t-2 border-[#121212] border-opacity-20 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-xl sm:text-2xl font-bold text-[#121212]"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Total:
                    </span>
                    <span
                      className="text-2xl sm:text-3xl font-black text-[#121212]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      ${(getCartTotal() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information & Payment */}
            <div className="order-1 lg:order-2">
              <h2
                className="text-xl sm:text-2xl font-bold text-[#121212] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                Contact Information
              </h2>
              <div
                className="bg-[#F7F7F5] p-6 sm:p-8"
                style={{
                  borderRadius: "0px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Pickup Notice */}
                <div
                  className="bg-[#E9B60A] bg-opacity-20 border-2 border-[#E9B60A] border-opacity-30 p-4 mb-6"
                  style={{ borderRadius: "0px" }}
                >
                  <p className="text-sm text-[#121212] font-medium">
                    🏪 This is a <strong>pickup order</strong>. We'll contact
                    you when it's ready!
                  </p>
                </div>

                <div className="space-y-5 sm:space-y-6 mb-8">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Full Name <span className="text-[#E97F8A]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      placeholder="Enter your full name"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Email Address <span className="text-[#E97F8A]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      placeholder="your@email.com"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Phone Number <span className="text-[#E97F8A]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      placeholder="+1 (555) 123-4567"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mb-8">
                  <h3
                    className="text-base sm:text-lg font-bold text-[#121212] mb-4"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    Payment
                  </h3>
                  <div
                    className="bg-[#3973B8] bg-opacity-20 border-2 border-[#3973B8] border-opacity-30 p-4"
                    style={{ borderRadius: "0px" }}
                  >
                    <p className="text-sm text-[#121212] font-semibold mb-1">
                      💳 Mock Payment
                    </p>
                    <p className="text-xs text-[#121212] opacity-60">
                      This is a demo. Your order will be processed without
                      actual payment.
                    </p>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ borderRadius: "0px" }}
                >
                  {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
