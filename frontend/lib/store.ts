import { create } from 'zustand';
import { User, Product, CartItem, AddOn } from '@/types';
import api from './api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, selectedAddons?: AddOn[]) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
}

// Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, loading: false });
      toast.success('Login successful!');
      
      return user; // Return user for immediate role-based routing
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  register: async (data: any) => {
    try {
      set({ loading: true });
      const response = await api.post('/register', data);
      const { user, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, loading: false });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      
      // Handle Laravel validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  },

  loadUser: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      set({ loading: true });
      const response = await api.put('/profile', data);
      const updatedUser = response.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  },
}));

// Cart Store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/cart');
      set({ items: response.data.items || [], loading: false });
      
      // Notify user if any items were removed due to unavailability
      if (response.data.removed_items && response.data.removed_items.length > 0) {
        const removedNames = response.data.removed_items.join(', ');
        toast.error(`Some items are no longer available and were removed from your cart: ${removedNames}`, {
          duration: 5000,
        });
      }
    } catch (error: any) {
      set({ loading: false });
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch cart');
      }
    }
  },

  addToCart: async (productId: string, quantity: number = 1, selectedAddons?: AddOn[]) => {
    try {
      const response = await api.post('/cart/add', { 
        product_id: productId, 
        quantity,
        selected_addons: selectedAddons || []
      });
      set({ items: response.data.items || [] });
      
      // Check for removed items
      if (response.data.removed_items && response.data.removed_items.length > 0) {
        const removedNames = response.data.removed_items.join(', ');
        toast.error(`Some items are no longer available and were removed from your cart: ${removedNames}`, {
          duration: 5000,
        });
      }
      
      toast.success('Item added to cart successfully!');
    } catch (error: any) {
      // Show specific validation errors if available
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        toast.error(errorMessage as string);
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
      throw error;
    }
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      set({ items: response.data.items || [] });
      
      // Check for removed items
      if (response.data.removed_items && response.data.removed_items.length > 0) {
        const removedNames = response.data.removed_items.join(', ');
        toast.error(`Some items are no longer available and were removed from your cart: ${removedNames}`, {
          duration: 5000,
        });
      }
      
      toast.success('Quantity updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update quantity');
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      set({ items: response.data.items || [] });
      
      // Check for removed items
      if (response.data.removed_items && response.data.removed_items.length > 0) {
        const removedNames = response.data.removed_items.join(', ');
        toast.error(`Some items are no longer available and were removed from your cart: ${removedNames}`, {
          duration: 5000,
        });
      }
      
      toast.success('Item removed from cart successfully!');
    } catch (error: any) {
      toast.error('Failed to remove item');
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ items: [] });
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error('Failed to clear cart');
      throw error;
    }
  },

  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      
      // Add selected add-ons price if they exist
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        const addonsTotal = item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
        itemTotal += addonsTotal * item.quantity;
      }
      
      return total + itemTotal;
    }, 0);
  },

  getCartCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));

// Product Store
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/products');
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch products');
    }
  },
}));

