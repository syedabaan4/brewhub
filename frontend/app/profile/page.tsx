"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { Order } from "@/types";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { isAuthenticated, user, updateProfile, loading } = useAuthStore();
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
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
    } catch (error: any) {
      toast.error("Failed to load order history");
    } finally {
      setLoadingOrders(false);
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

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#4AA5A2]";
      case "processing":
        return "bg-[#3973B8]";
      case "cancelled":
        return "bg-[#E97F8A]";
      default:
        return "bg-[#E9B60A]";
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

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#121212] mb-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            My Account
          </h1>
          <p className="text-sm sm:text-base text-[#121212] opacity-60">
            Manage your profile and view order history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 sm:px-6 py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-[0.03em] uppercase transition-all ${
              activeTab === "profile"
                ? "bg-[#121212] text-[#F7F7F5]"
                : "bg-[#F7F7F5] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 sm:px-6 py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-[0.03em] uppercase transition-all ${
              activeTab === "orders"
                ? "bg-[#121212] text-[#F7F7F5]"
                : "bg-[#F7F7F5] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            Order History
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 lg:p-10"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                      Full Name
                    </label>
                    <p className="text-base sm:text-lg text-[#121212] font-medium">
                      {user.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                      Email Address
                    </label>
                    <p className="text-base sm:text-lg text-[#121212] font-medium">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                      Phone Number
                    </label>
                    <p className="text-base sm:text-lg text-[#121212] font-medium">
                      {user.phone || (
                        <span className="opacity-40">Not provided</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-2">
                      Address
                    </label>
                    <p className="text-base sm:text-lg text-[#121212] font-medium">
                      {user.address || (
                        <span className="opacity-40">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                  style={{ borderRadius: "0px" }}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30 resize-none"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: "0px" }}
                    >
                      {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
                      style={{ borderRadius: "0px" }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </>
            )}
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
              <div className="space-y-6">
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
                            {order.status}
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
                        {order.items.map((item: any, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start gap-4"
                          >
                            <div className="flex-1">
                              <p className="text-sm sm:text-base text-[#121212] font-semibold mb-1">
                                {item.quantity}×{" "}
                                {item.product_name ||
                                  item.product?.name ||
                                  "Item"}
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
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t-2 border-[#121212] border-opacity-10 pt-6 mb-6">
                      <h4 className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-4">
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                    </div>

                    {/* Status Messages */}
                    {order.status === "pending" && (
                      <div
                        className="bg-[#E9B60A] bg-opacity-20 border-2 border-[#E9B60A] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          🏪 Your order is being prepared. We'll contact you
                          when it's ready for pickup!
                        </p>
                      </div>
                    )}
                    {order.status === "processing" && (
                      <div
                        className="bg-[#3973B8] bg-opacity-20 border-2 border-[#3973B8] border-opacity-30 p-4"
                        style={{ borderRadius: "0px" }}
                      >
                        <p className="text-sm text-[#121212] font-medium">
                          ☕ Your order is being prepared!
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
