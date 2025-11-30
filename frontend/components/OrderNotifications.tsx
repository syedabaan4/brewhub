"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; emoji: string; message: string; accent: string }
> = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    message: "Your order is being processed.",
    accent: "#E9B60A",
  },
  received: {
    label: "Received",
    emoji: "📋",
    message: "We've received your order!",
    accent: "#4AA5A2",
  },
  preparing: {
    label: "Preparing",
    emoji: "☕",
    message: "Our baristas are crafting your order.",
    accent: "#E9B60A",
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    emoji: "🔔",
    message: "Your order is ready! Come pick it up.",
    accent: "#4AA5A2",
  },
  completed: {
    label: "Completed",
    emoji: "✅",
    message: "Order completed. Thank you!",
    accent: "#4AA5A2",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "❌",
    message: "Order has been cancelled.",
    accent: "#E97F8A",
  },
};

// Active statuses that we should monitor
const ACTIVE_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready_for_pickup",
];

export default function OrderNotifications() {
  const { isAuthenticated, user } = useAuthStore();
  const statusMapRef = useRef<Map<string, OrderStatus>>(new Map());
  const initializedRef = useRef(false);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback(
    (order: Order, newStatus: OrderStatus) => {
      const config = STATUS_CONFIG[newStatus];

      // Show custom dismissable toast with on-brand styling
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } flex items-start gap-4 bg-[#F7F7F5] p-4 sm:p-5 max-w-[400px] w-full cursor-pointer transition-all hover:translate-y-[-2px]`}
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
              borderLeft: `4px solid ${config.accent}`,
            }}
            onClick={() => toast.dismiss(t.id)}
            role="alert"
          >
            {/* Emoji */}
            <span className="text-2xl flex-shrink-0">{config.emoji}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold text-[#121212] uppercase mb-1"
                style={{ letterSpacing: "0.1em" }}
              >
                Order #{order.order_number}
              </p>
              <p
                className="text-sm font-semibold text-[#121212]"
                style={{ letterSpacing: "0.01em" }}
              >
                {config.message}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="flex-shrink-0 self-center text-[#121212] opacity-40 hover:opacity-100 transition-opacity p-1"
              aria-label="Dismiss notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ),
        {
          duration: 6000,
          position: "top-right",
        },
      );

      // Show browser notification if tab is hidden
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        document.hidden
      ) {
        new Notification(`${config.emoji} Order ${config.label}`, {
          body: `#${order.order_number}: ${config.message}`,
          icon: "/favicon.ico",
        });
      }
    },
    [],
  );

  const checkOrders = useCallback(async () => {
    if (!isAuthenticated || user?.is_admin) return;

    try {
      const response = await api.get("/orders");
      const orders: Order[] = response.data;

      // Filter to active orders only
      const activeOrders = orders.filter((o) =>
        ACTIVE_STATUSES.includes(o.status),
      );

      // Check each active order for status changes
      activeOrders.forEach((order) => {
        const orderId = (order as never as { _id?: string })._id || order.id;
        const previousStatus = statusMapRef.current.get(orderId);

        // Only notify if we've seen this order before and status changed
        if (
          initializedRef.current &&
          previousStatus &&
          previousStatus !== order.status
        ) {
          showNotification(order, order.status);
        }

        // Update tracked status
        statusMapRef.current.set(orderId, order.status);
      });

      // Also track completed/cancelled orders to detect those transitions
      orders.forEach((order) => {
        const orderId = (order as never as { _id?: string })._id || order.id;
        const previousStatus = statusMapRef.current.get(orderId);

        if (
          initializedRef.current &&
          previousStatus &&
          ACTIVE_STATUSES.includes(previousStatus) &&
          !ACTIVE_STATUSES.includes(order.status)
        ) {
          // Order transitioned from active to completed/cancelled
          showNotification(order, order.status);
        }

        statusMapRef.current.set(orderId, order.status);
      });

      initializedRef.current = true;
    } catch {
      // Silently fail - don't interrupt user experience
    }
  }, [isAuthenticated, user, showNotification]);

  useEffect(() => {
    if (!isAuthenticated || user?.is_admin) return;

    // Initial check
    checkOrders();

    // Poll every 15 seconds
    const interval = setInterval(checkOrders, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, checkOrders]);

  // This component doesn't render anything
  return null;
}
