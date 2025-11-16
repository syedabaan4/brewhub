"use client";

import Link from "next/link";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    router.push("/login");
  };

  return (
    <nav
      className="bg-[#121212] text-[#F7F7F5] shadow-md"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ letterSpacing: "-0.01em" }}
            >
              BrewHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/menu"
              className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
              style={{ borderRadius: "0px" }}
            >
              Menu
            </Link>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Cart
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-[#E9B60A] text-[#121212] text-xs font-black w-5 h-5 flex items-center justify-center"
                      style={{ borderRadius: "0px" }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  href="/profile"
                  className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Login
                </Link>

                {/* Sign Up CTA */}
                <Link
                  href="/register"
                  className="bg-[#E9B60A] text-[#121212] px-4 sm:px-6 py-2 sm:py-3 font-black text-xs sm:text-sm tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
                  style={{ borderRadius: "0px" }}
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
