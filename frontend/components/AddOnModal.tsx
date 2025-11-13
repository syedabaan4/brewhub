'use client';

import { useState } from 'react';
import { Product, AddOn } from '@/types';

interface AddOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (selectedAddons: AddOn[], quantity: number) => void;
}

export default function AddOnModal({ product, isOpen, onClose, onAddToCart }: AddOnModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddonToggle = (addon: AddOn) => {
    if (!addon.available) return;

    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isAddonSelected = (addon: AddOn) => {
    return selectedAddons.some((a) => a.name === addon.name);
  };

  const calculateTotal = () => {
    const basePrice = product.price * quantity;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * quantity;
    return basePrice + addonsPrice;
  };

  const handleAddToCart = () => {
    onAddToCart(selectedAddons, quantity);
    setSelectedAddons([]);
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    setSelectedAddons([]);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto z-10"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#2C1810]">{product.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-lg font-bold text-[#6F4E37] mt-2">${product.price.toFixed(2)}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#2C1810] mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-[#6F4E37] text-[#6F4E37] font-bold hover:bg-[#6F4E37] hover:text-white transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold text-[#2C1810] w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border-2 border-[#6F4E37] text-[#6F4E37] font-bold hover:bg-[#6F4E37] hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2C1810] mb-3">Customize Your Drink</label>
              <div className="space-y-2">
                {product.addons.map((addon, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddonToggle(addon)}
                    disabled={!addon.available}
                    className={`w-full flex justify-between items-center p-3 rounded-lg border-2 transition-all ${
                      !addon.available
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : isAddonSelected(addon)
                        ? 'border-[#6F4E37] bg-[#F5E6D3]'
                        : 'border-gray-200 hover:border-[#6F4E37]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          !addon.available
                            ? 'border-gray-300'
                            : isAddonSelected(addon)
                            ? 'border-[#6F4E37] bg-[#6F4E37]'
                            : 'border-gray-300'
                        }`}
                      >
                        {isAddonSelected(addon) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className={`font-medium ${!addon.available ? 'text-gray-400' : 'text-[#2C1810]'}`}>
                        {addon.name}
                        {!addon.available && ' (Unavailable)'}
                      </span>
                    </div>
                    <span className={`font-semibold ${!addon.available ? 'text-gray-400' : 'text-[#6F4E37]'}`}>
                      +${addon.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-[#2C1810]">Total:</span>
            <span className="text-2xl font-bold text-[#6F4E37]">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-[#6F4E37] text-[#6F4E37] font-semibold hover:bg-[#F5E6D3] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-3 rounded-lg bg-[#6F4E37] text-white font-semibold hover:bg-[#5C3D2E] transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

