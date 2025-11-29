"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; emoji: string; color: string; bgColor: string; message: string }
> = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    color: "text-[#E9B60A]",
    bgColor: "bg-[#E9B60A]",
    message: "Your order is being processed.",
  },
  received: {
    label: "Received",
    emoji: "📋",
    color: "text-[#3973B8]",
    bgColor: "bg-[#3973B8]",
    message: "We've received your order and it will be prepared shortly.",
  },
  preparing: {
    label: "Preparing",
    emoji: "☕",
    color: "text-[#E9B60A]",
    bgColor: "bg-[#E9B60A]",
    message: "Our baristas are crafting your order with care.",
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    emoji: "🔔",
    color: "text-[#4AA5A2]",
    bgColor: "bg-[#4AA5A2]",
    message: "Your order is ready! Please come to the counter.",
  },
  completed: {
    label: "Completed",
    emoji: "✅",
    color: "text-[#4AA5A2]",
    bgColor: "bg-[#4AA5A2]",
    message: "Order completed. Thank you for your purchase!",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "❌",
    color: "text-[#E97F8A]",
    bgColor: "bg-[#E97F8A]",
    message: "This order has been cancelled.",
  },
};

const STATUS_STEPS: OrderStatus[] = [
  "received",
  "preparing",
  "ready_for_pickup",
  "completed",
];

// Request browser notification permission
const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

// Show browser notification (for background tabs)
const showBrowserNotification = (title: string, body: string, emoji: string) => {
  if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
    new Notification(`${emoji} ${title}`, { body, icon: "/favicon.ico" });
  }
};

export default function OrderTrackingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousStatusRef = useRef<OrderStatus | null>(null);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const newOrder = response.data;
      
      // Check for status change and notify
      if (previousStatusRef.current && previousStatusRef.current !== newOrder.status) {
        const statusConfig = STATUS_CONFIG[newOrder.status as OrderStatus];
        const toastMessage = `${statusConfig.emoji} Order ${statusConfig.label}: ${statusConfig.message}`;
        
        // Show toast notification
        toast.success(toastMessage, { duration: 6000 });
        
        // Show browser notification if tab is not focused
        showBrowserNotification(
          `Order ${statusConfig.label}`,
          statusConfig.message,
          statusConfig.emoji
        );
      }
      
      previousStatusRef.current = newOrder.status;
      setOrder(newOrder);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Order not found");
      } else if (err.response?.status !== 401) {
        setError("Failed to load order");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Redirect admin users to admin panel
    if (user?.is_admin) {
      router.push("/admin/orders");
      return;
    }

    fetchOrder();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, router, fetchOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatETA = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIndex = (status: OrderStatus): number => {
    const index = STATUS_STEPS.indexOf(status);
    return index >= 0 ? index : -1;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDECE8]">
        <Navbar />
        <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div className="text-center py-20">
            <div
              className="inline-block bg-[#F7F7F5] px-8 sm:px-12 py-6 sm:py-8"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p className="text-xl sm:text-2xl text-[#121212] opacity-60 font-bold tracking-wide">
                LOADING...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#EDECE8]">
        <Navbar />
        <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div className="text-center py-20">
            <div
              className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p
                className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3 sm:mb-4"
                style={{ letterSpacing: "-0.01em" }}
              >
                {error || "Order Not Found"}
              </p>
              <p className="text-[#121212] opacity-50 text-base sm:text-lg mb-6">
                We couldn't find this order
              </p>
              <button
                onClick={() => router.push("/profile")}
                className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                VIEW MY ORDERS
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const currentStepIndex = getStatusIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const isCompleted = order.status === "completed";
  const eta = formatETA(order.estimated_completion_time);

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
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl sm:text-7xl mb-6">{statusConfig.emoji}</div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#121212] mb-3"
              style={{ letterSpacing: "-0.01em" }}
            >
              {statusConfig.label}
            </h1>
            <p className="text-sm sm:text-base text-[#121212] opacity-60">
              {statusConfig.message}
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
                {order.order_number}
              </p>
            </div>
          </div>

          {/* ETA Display */}
          {eta && !isCompleted && !isCancelled && (
            <div
              className="bg-[#3973B8] bg-opacity-20 border-2 border-[#3973B8] border-opacity-30 p-4 sm:p-6 mb-8 text-center"
              style={{ borderRadius: "0px" }}
            >
              <p className="text-[10px] sm:text-xs font-bold text-[#121212] opacity-60 tracking-[0.15em] uppercase mb-2">
                Estimated Ready Time
              </p>
              <p
                className="text-2xl sm:text-3xl font-black text-[#121212]"
                style={{ letterSpacing: "-0.01em" }}
              >
                {eta}
              </p>
            </div>
          )}

          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="mb-10">
              <h2 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-6 text-center">
                Order Progress
              </h2>
              <div className="flex items-center justify-between relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-[#121212] bg-opacity-10 mx-8" />
                
                {/* Progress Line Fill */}
                <div
                  className="absolute top-5 left-0 h-1 bg-[#4AA5A2] mx-8 transition-all duration-500"
                  style={{
                    width: `calc(${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}% - 4rem)`,
                  }}
                />

                {STATUS_STEPS.map((step, index) => {
                  const stepConfig = STATUS_CONFIG[step];
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center text-xl transition-all duration-300 ${
                          isActive
                            ? "bg-[#4AA5A2]"
                            : "bg-[#F7F7F5] border-2 border-[#121212] border-opacity-20"
                        } ${isCurrent ? "scale-125 shadow-lg" : ""}`}
                        style={{ borderRadius: "0px" }}
                      >
                        {stepConfig.emoji}
                      </div>
                      <p
                        className={`mt-3 text-[10px] font-bold tracking-[0.1em] uppercase text-center max-w-[80px] ${
                          isActive ? "text-[#121212]" : "text-[#121212] opacity-40"
                        }`}
                      >
                        {stepConfig.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-8">
            <h2
              className="text-xl sm:text-2xl font-bold text-[#121212] mb-6"
              style={{ letterSpacing: "-0.01em" }}
            >
              Order Summary
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-[#121212] mb-1">
                      {item.product_name || "Item"}
                    </p>
                    <p className="text-xs sm:text-sm text-[#121212] opacity-50">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    {item.selected_addons && item.selected_addons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.selected_addons.map((addon: any, idx: number) => (
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
                      if (item.selected_addons && item.selected_addons.length > 0) {
                        const addonsTotal = item.selected_addons.reduce(
                          (sum: number, addon: any) => sum + addon.price,
                          0
                        );
                        total += addonsTotal * item.quantity;
                      }
                      return total.toFixed(2);
                    })()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm sm:text-base mb-4 mt-6">
              <span className="text-[#121212] opacity-60">Subtotal:</span>
              <span className="font-bold text-[#121212]">
                ${order.total_price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-[#121212] opacity-60">Tax (8%):</span>
              <span className="font-bold text-[#121212]">
                ${(order.total_price * 0.08).toFixed(2)}
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
                  ${(order.total_price * 1.08).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div
            className="bg-white border-2 border-[#121212] border-opacity-10 p-5 sm:p-6 mb-8"
            style={{ borderRadius: "0px" }}
          >
            <h3 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-4">
              Order Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="text-[#121212] opacity-50 font-medium">
                  Order Date:
                </span>
                <span className="text-[#121212] font-semibold">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#121212] opacity-50 font-medium">Name:</span>
                <span className="text-[#121212] font-semibold">
                  {order.customer_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#121212] opacity-50 font-medium">Email:</span>
                <span className="text-[#121212] font-semibold">
                  {order.customer_email}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#121212] opacity-50 font-medium">Phone:</span>
                <span className="text-[#121212] font-semibold">
                  {order.customer_phone}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time indicator */}
          <div className="text-center mb-8">
            <p className="text-xs text-[#121212] opacity-40">
              You'll be notified when status changes
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="flex-1 bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              MY ORDERS
            </button>
            <button
              onClick={() => router.push("/menu")}
              className="flex-1 bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              ORDER AGAIN
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

