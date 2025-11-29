"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "preparing", label: "Preparing" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-[#E9B60A]",
  received: "bg-[#3973B8]",
  preparing: "bg-[#E9B60A]",
  ready_for_pickup: "bg-[#4AA5A2]",
  completed: "bg-[#4AA5A2]",
  cancelled: "bg-[#E97F8A]",
};

export default function AdminOrdersPage() {
  const { isAuthenticated, user, loadUser } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
    setAuthChecked(true);
  }, [loadUser]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user is admin (client-side check, server validates too)
    if (user && user.is_admin !== true) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    // Only fetch if user appears to be admin
    if (user?.is_admin) {
      fetchOrders();

      // Poll for updates every 15 seconds
      const interval = setInterval(fetchOrders, 15000);
      return () => clearInterval(interval);
    }
  }, [authChecked, isAuthenticated, user, router, fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleETAUpdate = async (orderId: string, etaMinutes: number) => {
    setUpdating(orderId);
    try {
      const eta = new Date(Date.now() + etaMinutes * 60 * 1000).toISOString();
      await api.put(`/admin/orders/${orderId}`, { estimated_completion_time: eta });
      toast.success("ETA updated successfully");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update ETA");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatETA = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: OrderStatus) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    return option?.label || status;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (error && !orders.length) {
    return (
      <div className="min-h-screen bg-[#EDECE8]">
        <Navbar />
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="text-center py-20">
            <div
              className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p
                className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3 sm:mb-4"
                style={{ letterSpacing: "-0.01em" }}
              >
                Access Denied
              </p>
              <p className="text-[#121212] opacity-50 text-base sm:text-lg mb-6">
                {error}
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                GO HOME
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#E9B60A] px-4 py-1.5">
              <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                Admin
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#121212]"
              style={{ letterSpacing: "-0.01em" }}
            >
              Order Management
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#121212] opacity-60">
            Update order statuses and estimated completion times
          </p>
        </div>

        {loading ? (
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
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p
                className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                No Orders Yet
              </p>
              <p className="text-[#121212] opacity-50 text-base sm:text-lg">
                Orders will appear here when customers place them
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Real-time indicator */}
            <div className="text-right">
              <p className="text-xs text-[#121212] opacity-40">
                🔄 Auto-refreshing every 15 seconds
              </p>
            </div>

            {orders.map((order) => (
              <div
                key={(order as any)._id || order.id}
                className="bg-[#F7F7F5] p-6 sm:p-8"
                style={{
                  borderRadius: "0px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-[#E9B60A] px-4 py-1.5">
                        <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                          #{order.order_number}
                        </span>
                      </div>
                      <div
                        className={`${STATUS_COLORS[order.status]} px-4 py-1.5`}
                        style={{ borderRadius: "0px" }}
                      >
                        <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#121212] opacity-70">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Status Update */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                        Update Status
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            (order as any)._id || order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        disabled={updating === ((order as any)._id || order.id)}
                        className="px-4 py-2 border-2 border-[#121212] border-opacity-20 bg-white text-[#121212] text-sm font-medium focus:outline-none focus:border-[#121212] focus:border-opacity-40 disabled:opacity-50"
                        style={{ borderRadius: "0px" }}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ETA Update */}
                    {!["completed", "cancelled"].includes(order.status) && (
                      <div>
                        <label className="block text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                          Set ETA (minutes)
                        </label>
                        <div className="flex gap-2">
                          {[5, 10, 15, 20, 30].map((mins) => (
                            <button
                              key={mins}
                              onClick={() =>
                                handleETAUpdate(
                                  (order as any)._id || order.id,
                                  mins
                                )
                              }
                              disabled={updating === ((order as any)._id || order.id)}
                              className="px-3 py-2 border-2 border-[#121212] border-opacity-20 bg-white text-[#121212] text-xs font-bold hover:bg-[#121212] hover:text-[#F7F7F5] transition-all disabled:opacity-50"
                              style={{ borderRadius: "0px" }}
                            >
                              {mins}m
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer & Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-1">
                      Customer
                    </p>
                    <p className="text-sm font-semibold text-[#121212]">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-[#121212] opacity-60">
                      {order.customer_phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-1">
                      Email
                    </p>
                    <p className="text-sm text-[#121212]">
                      {order.customer_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-1">
                      ETA
                    </p>
                    <p className="text-sm font-semibold text-[#121212]">
                      {formatETA(order.estimated_completion_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-1">
                      Total
                    </p>
                    <p className="text-lg font-black text-[#121212]">
                      ${(order.total_price * 1.08).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t-2 border-[#121212] border-opacity-10 pt-4">
                  <p className="text-[10px] font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                    Items ({order.items?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white border border-[#121212] border-opacity-10 px-3 py-2"
                        style={{ borderRadius: "0px" }}
                      >
                        <span className="text-sm font-medium text-[#121212]">
                          {item.quantity}× {item.product_name || "Item"}
                        </span>
                        {item.selected_addons && item.selected_addons.length > 0 && (
                          <span className="text-xs text-[#121212] opacity-60 ml-2">
                            (+{item.selected_addons.length} add-ons)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

