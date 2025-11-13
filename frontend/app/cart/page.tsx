'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ConfirmModal from '@/components/ConfirmModal';
import { useCartStore, useAuthStore } from '@/lib/store';

export default function CartPage() {
  const { items, loading, fetchCart, updateCartItem, removeFromCart, getCartTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    // If quantity becomes 0, remove the item with confirmation
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItemToRemove(itemId);
    setIsModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    
    try {
      await removeFromCart(itemToRemove);
      setIsModalOpen(false);
      setItemToRemove(null);
    } catch (error) {
      // Error handled in store
    }
  };

  const cancelRemove = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2C1810] mb-8">Your Cart</h1>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Loading cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/menu" className="btn-primary inline-block">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.product_id} className="card p-4 flex gap-4">
                  <div className="w-24 h-24 bg-[#F5E6D3] rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-3xl">☕</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C1810]">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      ${item.price.toFixed(2)} each
                    </p>
                    
                    {/* Display selected add-ons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.selectedAddons.map((addon, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-[#F5E6D3] text-[#6F4E37] px-2 py-0.5 rounded"
                            >
                              {addon.name} (+${addon.price.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#6F4E37]">
                      ${(() => {
                        let total = item.price * item.quantity;
                        if (item.selectedAddons && item.selectedAddons.length > 0) {
                          const addonsTotal = item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
                          total += addonsTotal * item.quantity;
                        }
                        return total.toFixed(2);
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-[#2C1810] mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%):</span>
                  <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-[#2C1810]">Total:</span>
                    <span className="text-2xl font-bold text-[#6F4E37]">
                      ${(getCartTotal() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="btn-primary w-full text-center block"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  );
}

