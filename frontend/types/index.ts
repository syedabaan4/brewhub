export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface AddOn {
  name: string;
  price: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  addons?: AddOn[];
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  price: number;
  selectedAddons?: AddOn[];
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  items: CartItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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

