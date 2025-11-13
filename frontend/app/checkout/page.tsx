'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCartStore, useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
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
      toast.error('Please enter your name');
      return;
    }
    if (!customerEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(customerPhone) || customerPhone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const response = await api.post('/orders', {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_price: getCartTotal(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_status: 'paid', // Mock payment
      });

      setOrderNumber(response.data.order_number);
      setCompletedOrder(response.data);
      await clearCart();
      setOrderCompleted(true);
      toast.success('Order placed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (orderCompleted && completedOrder) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-[#2C1810] mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600">
                Thank you for your order. Your coffee is being prepared!
              </p>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-[#6F4E37]">{orderNumber}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {completedOrder.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.product_name || 'Item'}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-[#6F4E37]">
                    ${completedOrder.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5E6D3] p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {completedOrder.customer_name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {completedOrder.customer_email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Phone:</strong> {completedOrder.customer_phone}
              </p>
              <p className="text-sm text-gray-600 mt-3">
                📧 A confirmation email has been sent to {completedOrder.customer_email}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                🏪 This is a pickup order. We'll contact you when it's ready!
              </p>
            </div>

            <button
              onClick={() => router.push('/menu')}
              className="btn-primary w-full"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2C1810] mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/menu')}
              className="btn-primary"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="card p-6">
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-[#6F4E37]">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information & Payment */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="card p-6 mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  🏪 This is a <strong>pickup order</strong>. We'll contact you when it's ready!
                </p>

                <div className="space-y-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">Payment</h3>
                <div className="bg-[#F5E6D3] p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    💳 <strong>Mock Payment</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This is a demo. Your order will be processed without actual payment.
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

