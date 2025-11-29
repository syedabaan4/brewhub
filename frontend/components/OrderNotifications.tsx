"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<OrderStatus, { label: string; emoji: string; message: string }> = {
  pending: { label: "Pending", emoji: "⏳", message: "Your order is being processed." },
  received: { label: "Received", emoji: "📋", message: "We've received your order!" },
  preparing: { label: "Preparing", emoji: "☕", message: "Our baristas are crafting your order." },
  ready_for_pickup: { label: "Ready for Pickup", emoji: "🔔", message: "Your order is ready! Come pick it up." },
  completed: { label: "Completed", emoji: "✅", message: "Order completed. Thank you!" },
  cancelled: { label: "Cancelled", emoji: "❌", message: "Order has been cancelled." },
};

// Active statuses that we should monitor
const ACTIVE_STATUSES: OrderStatus[] = ["received", "preparing", "ready_for_pickup"];

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

  const showNotification = useCallback((order: Order, newStatus: OrderStatus) => {
    const config = STATUS_CONFIG[newStatus];
    const message = `${config.emoji} Order #${order.order_number}: ${config.message}`;

    // Show toast
    toast.success(message, { duration: 6000 });

    // Show browser notification if tab is hidden
    if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
      new Notification(`${config.emoji} Order ${config.label}`, {
        body: `#${order.order_number}: ${config.message}`,
        icon: "/favicon.ico",
      });
    }
  }, []);

  const checkOrders = useCallback(async () => {
    if (!isAuthenticated || user?.is_admin) return;

    try {
      const response = await api.get("/orders");
      const orders: Order[] = response.data;

      // Filter to active orders only
      const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

      // Check each active order for status changes
      activeOrders.forEach((order) => {
        const orderId = (order as any)._id || order.id;
        const previousStatus = statusMapRef.current.get(orderId);

        // Only notify if we've seen this order before and status changed
        if (initializedRef.current && previousStatus && previousStatus !== order.status) {
          showNotification(order, order.status);
        }

        // Update tracked status
        statusMapRef.current.set(orderId, order.status);
      });

      // Also track completed/cancelled orders to detect those transitions
      orders.forEach((order) => {
        const orderId = (order as any)._id || order.id;
        const previousStatus = statusMapRef.current.get(orderId);

        if (initializedRef.current && previousStatus && ACTIVE_STATUSES.includes(previousStatus) && !ACTIVE_STATUSES.includes(order.status)) {
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

