export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  _id: string;
  user_id: string;
  items: CartItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  delivery_address: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

