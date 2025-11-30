"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReviewFormModal from "@/components/ReviewFormModal";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order, OrderReviewStatus } from "@/types";
import toast from "react-hot-toast";

function ProfilePageContent() {
  const { isAuthenticated, user, updateProfile, loading, loadUser } =
    useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [searchParams]);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    orderId: string;
    orderItemIndex: number;
    productId: string;
    productName: string;
  } | null>(null);

  // Track which items have been reviewed per order
  const [orderReviewStatuses, setOrderReviewStatuses] = useState<{
    [orderId: string]: OrderReviewStatus;
  }>({});

  // Track which order's contact info is expanded
  const [expandedContactInfo, setExpandedContactInfo] = useState<string | null>(
    null,
  );

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "orders") {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get("/orders");
      setOrders(response.data);

      // Fetch review status for completed orders
      const completedOrders = response.data.filter(
        (order: Order) => order.status === "completed",
      );
      for (const order of completedOrders) {
        fetchOrderReviewStatus(order._id || order.id);
      }
    } catch (error: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderReviewStatus = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/review-status`);
      setOrderReviewStatuses((prev) => ({
        ...prev,
        [orderId]: response.data,
      }));
    } catch (error) {
      console.error("Failed to fetch review status:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditing(false);
  };

  const handleOpenReviewModal = (
    orderId: string,
    orderItemIndex: number,
    productId: string,
    productName: string,
  ) => {
    setReviewTarget({ orderId, orderItemIndex, productId, productName });
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    // Refresh review status for the order
    if (reviewTarget) {
      fetchOrderReviewStatus(reviewTarget.orderId);
    }
  };

  const isItemReviewed = (orderId: string, itemIndex: number): boolean => {
    const status = orderReviewStatuses[orderId];
    if (!status) return false;
    const itemStatus = status.items.find(
      (item) => item.order_item_index === itemIndex,
    );
    return itemStatus?.reviewed ?? false;
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#4AA5A2]";
      case "ready_for_pickup":
        return "bg-[#4AA5A2]";
      case "preparing":
        return "bg-[#E9B60A]";
      case "received":
        return "bg-[#3973B8]";
      case "cancelled":
        return "bg-[#E97F8A]";
      default:
        return "bg-[#E9B60A]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "received":
        return "Received";
      case "preparing":
        return "Preparing";
      case "ready_for_pickup":
        return "Ready for Pickup";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Page Title */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="bg-[#E9B60A] px-4 sm:px-6 py-2">
              <span className="text-[#121212] font-bold text-xs tracking-[0.2em] uppercase">
                Account
              </span>
            </div>
          </div>
          <h1
            className="text-[clamp(32px,8vw,64px)] font-bold text-[#121212] leading-[0.95]"
            style={{ letterSpacing: "-0.02em" }}
          >
            My Profile
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              activeTab === "profile"
                ? "bg-[#121212] text-[#F7F7F5]"
                : "bg-[#F7F7F5] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            PROFILE
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              activeTab === "orders"
                ? "bg-[#121212] text-[#F7F7F5]"
                : "bg-[#F7F7F5] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            MY ORDERS
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 lg:p-10 max-w-2xl"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212]"
                    style={{ borderRadius: "0px" }}
                    required
                  />
                ) : (
                  <p className="text-lg text-[#121212] font-semibold">
                    {user.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212]"
                    style={{ borderRadius: "0px" }}
                    required
                  />
                ) : (
                  <p className="text-lg text-[#121212] font-semibold">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212]"
                    style={{ borderRadius: "0px" }}
                  />
                ) : (
                  <p className="text-lg text-[#121212] font-semibold">
                    {user.phone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212] resize-none"
                    style={{ borderRadius: "0px" }}
                  />
                ) : (
                  <p className="text-lg text-[#121212] font-semibold">
                    {user.address || "Not provided"}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-4 border-2 border-[#121212] text-[#121212] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer"
                      style={{ borderRadius: "0px" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-4 bg-[#121212] text-[#F7F7F5] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer disabled:opacity-50"
                      style={{ borderRadius: "0px" }}
                    >
                      {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-4 bg-[#121212] text-[#F7F7F5] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
                    style={{ borderRadius: "0px" }}
                  >
                    EDIT PROFILE
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {loadingOrders ? (
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
            ) : orders.length === 0 ? (
              <div className="text-center py-20 sm:py-32">
                <div
                  className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
                  style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
                >
                  <p
                    className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3 sm:mb-4"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    No Orders Yet
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
              <div className="space-y-6 max-w-2xl">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#F7F7F5] p-6 sm:p-8"
                    style={{
                      borderRadius: "0px",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                      <div>
                        <div className="inline-block mb-2">
                          <div className="bg-[#E9B60A] px-4 py-1.5">
                            <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                              Order #{order.order_number}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#121212] opacity-70">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-3">
                        <div
                          className={`${getStatusColor(order.status)} px-6 py-2`}
                          style={{ borderRadius: "0px" }}
                        >
                          <span className="text-[#121212] font-black text-xs tracking-[0.15em] uppercase">
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div
                          className="text-2xl sm:text-3xl font-black text-[#121212]"
                          style={{ letterSpacing: "-0.02em" }}
                        >
                          ${order.total_price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t-2 border-[#121212] border-opacity-10 pt-6 mb-6">
                      <h4 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item: any, index) => {
                          const orderId = (order as any)._id || order.id;
                          const reviewed = isItemReviewed(orderId, index);
                          const productId = item.product_id;
                          const productName =
                            item.product_name || item.product?.name || "Item";

                          return (
                            <div
                              key={index}
                              className="flex justify-between items-start gap-4"
                            >
                              <div className="flex-1">
                                <p className="text-sm sm:text-base text-[#121212] font-semibold mb-1">
                                  {item.quantity}× {productName}
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
                                              {addon.name} (+$
                                              {addon.price.toFixed(2)})
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                {/* Review Button for Completed Orders */}
                                {order.status === "completed" && (
                                  <div className="mt-2">
                                    {reviewed ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#4AA5A2] tracking-[0.1em] uppercase">
                                        <span>✓</span> Reviewed
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleOpenReviewModal(
                                            orderId,
                                            index,
                                            productId,
                                            productName,
                                          )
                                        }
                                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#3973B8] hover:text-[#121212] tracking-[0.1em] uppercase transition-colors cursor-pointer"
                                      >
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                          />
                                        </svg>
                                        Write Review
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm sm:text-base text-[#121212] font-bold">
                                $
                                {(() => {
                                  let total = item.price * item.quantity;
                                  if (
                                    item.selected_addons &&
                                    item.selected_addons.length > 0
                                  ) {
                                    const addonsTotal =
                                      item.selected_addons.reduce(
                                        (sum: number, addon: any) =>
                                          sum + addon.price,
                                        0,
                                      );
                                    total += addonsTotal * item.quantity;
                                  }
                                  return total.toFixed(2);
                                })()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Information - Collapsible */}
                    <div className="border-t-2 border-[#121212] border-opacity-10 pt-4 mb-6">
                      <button
                        onClick={() =>
                          setExpandedContactInfo(
                            expandedContactInfo ===
                              ((order as any)._id || order.id)
                              ? null
                              : (order as any)._id || order.id,
                          )
                        }
                        className="w-full flex items-center justify-between py-2 cursor-pointer group"
                      >
                        <h4 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase group-hover:opacity-70 transition-opacity">
                          Contact Information
                        </h4>
                        <svg
                          className={`w-4 h-4 text-[#121212] opacity-50 transition-transform duration-200 ${
                            expandedContactInfo ===
                            ((order as any)._id || order.id)
                              ? "rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {expandedContactInfo ===
                        ((order as any)._id || order.id) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4">
                          <div>
                            <p className="text-xs text-[#121212] opacity-40 uppercase tracking-wide mb-1">
                              Name
                            </p>
                            <p className="font-medium text-[#121212]">
                              {order.customer_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#121212] opacity-40 uppercase tracking-wide mb-1">
                              Phone
                            </p>
                            <p className="font-medium text-[#121212]">
                              {order.customer_phone}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs text-[#121212] opacity-40 uppercase tracking-wide mb-1">
                              Email
                            </p>
                            <p className="font-medium text-[#121212]">
                              {order.customer_email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Messages */}
                    {(order.status === "pending" ||
                      order.status === "received") && (
                      <div
                        className="bg-[#3973B8] bg-opacity-20 border-2 border-[#3973B8] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          📋 Your order has been received and will be prepared
                          shortly.
                        </p>
                      </div>
                    )}
                    {order.status === "preparing" && (
                      <div
                        className="bg-[#E9B60A] bg-opacity-20 border-2 border-[#E9B60A] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          ☕ Our baristas are preparing your order!
                        </p>
                      </div>
                    )}
                    {order.status === "ready_for_pickup" && (
                      <div
                        className="bg-[#4AA5A2] bg-opacity-20 border-2 border-[#4AA5A2] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          🔔 Your order is ready! Please come to the counter to
                          pick it up.
                        </p>
                      </div>
                    )}
                    {order.status === "completed" && (
                      <div
                        className="bg-[#4AA5A2] bg-opacity-20 border-2 border-[#4AA5A2] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          ✅ Order completed. Thank you for your purchase!
                        </p>
                      </div>
                    )}
                    {order.status === "cancelled" && (
                      <div
                        className="bg-[#E97F8A] bg-opacity-20 border-2 border-[#E97F8A] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          ❌ This order has been cancelled.
                        </p>
                      </div>
                    )}

                    {/* Track Order Button - shown for active orders */}
                    {!["completed", "cancelled"].includes(order.status) && (
                      <button
                        onClick={() =>
                          router.push(
                            `/orders/${(order as any)._id || order.id}`,
                          )
                        }
                        className="w-full mt-4 bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 py-3 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                        style={{ borderRadius: "0px" }}
                      >
                        TRACK ORDER
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Review Form Modal */}
      {reviewTarget && (
        <ReviewFormModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={handleReviewSuccess}
          orderId={reviewTarget.orderId}
          orderItemIndex={reviewTarget.orderItemIndex}
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EDECE8]">
          <Navbar />
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
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
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
