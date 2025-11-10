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
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [isAuthenticated, user, router]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
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
        delivery_address: deliveryAddress,
        payment_status: 'paid', // Mock payment
      });

      setOrderId(response.data._id);
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

  if (orderCompleted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-[#2C1810] mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order. Your coffee is being prepared!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Order ID: {orderId}
            </p>
            <button
              onClick={() => router.push('/menu')}
              className="btn-primary"
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

            {/* Delivery & Payment */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
              <div className="card p-6 mb-6">
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent mb-4"
                  placeholder="Enter your delivery address"
                />

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

