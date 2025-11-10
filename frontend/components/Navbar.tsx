'use client';

import Link from 'next/link';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout, loadUser } = useAuthStore();
  const { getCartCount, fetchCart } = useCartStore();
  const router = useRouter();
  const cartCount = getCartCount();

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, loadUser, fetchCart]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-[#6F4E37] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold">
            ☕ Brewhub
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/menu" className="hover:text-[#D4A574] transition-colors">
              Menu
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative hover:text-[#D4A574] transition-colors">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="hover:text-[#D4A574] transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-[#D4A574] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[#D4A574] transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#D4A574] hover:bg-[#C89B6A] px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

