'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Order } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { isAuthenticated, user, updateProfile, loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error: any) {
      toast.error('Failed to load order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2C1810] mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'text-[#6F4E37] border-b-2 border-[#6F4E37]'
                : 'text-gray-600 hover:text-[#6F4E37]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'text-[#6F4E37] border-b-2 border-[#6F4E37]'
                : 'text-gray-600 hover:text-[#6F4E37]'
            }`}
          >
            Order History
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-8">
          {!isEditing ? (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <p className="text-lg text-[#2C1810]">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-lg text-[#2C1810]">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <p className="text-lg text-[#2C1810]">
                    {user.phone || 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <p className="text-lg text-[#2C1810]">
                    {user.address || 'Not provided'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 card p-8">
                <p className="text-xl text-gray-600 mb-4">No orders yet</p>
                <button
                  onClick={() => router.push('/menu')}
                  className="btn-primary"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2C1810] mb-1">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-lg font-bold text-[#6F4E37]">
                          ${order.total_price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700">
                        Order Items:
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {item.quantity}x {item.product_name || item.product?.name || 'Item'}
                            </span>
                            <span className="text-gray-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Contact Name:</p>
                          <p className="font-medium">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone:</p>
                          <p className="font-medium">{order.customer_phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Email:</p>
                          <p className="font-medium">{order.customer_email}</p>
                        </div>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="mt-4 bg-[#F5E6D3] p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          🏪 Your order is being prepared. We'll contact you when it's ready for pickup!
                        </p>
                      </div>
                    )}
                    {order.status === 'processing' && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          ☕ Your order is being prepared!
                        </p>
                      </div>
                    )}
                    {order.status === 'completed' && (
                      <div className="mt-4 bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
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

