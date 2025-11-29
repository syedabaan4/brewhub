"use client";

import Link from "next/link";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, user, logout, loadUser } = useAuthStore();
  const { getCartCount, fetchCart } = useCartStore();
  const router = useRouter();
  const cartCount = getCartCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    loadUser();
    if (isAuthenticated && !isAdmin) {
      fetchCart();
    }
  }, [isAuthenticated, loadUser, fetchCart, isAdmin]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className="bg-[#121212] text-[#F7F7F5] shadow-md relative z-50"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <span
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ letterSpacing: "-0.01em" }}
            >
              BrewHub
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && isAdmin ? (
              <>
                {/* Admin Badge */}
                <div className="bg-[#E9B60A] px-3 py-1 mr-2">
                  <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                    Admin
                  </span>
                </div>

                {/* Orders Management */}
                <Link
                  href="/admin/orders"
                  className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Orders
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/menu"
                  className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                  style={{ borderRadius: "0px" }}
                >
                  Menu
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* Cart */}
                    <Link
                      href="/cart"
                      className="relative px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
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
                      className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                      style={{ borderRadius: "0px" }}
                    >
                      Profile
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
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
                      className="px-4 lg:px-6 py-2 lg:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
                      style={{ borderRadius: "0px" }}
                    >
                      Login
                    </Link>

                    {/* Sign Up CTA */}
                    <Link
                      href="/register"
                      className="bg-[#E9B60A] text-[#121212] px-4 lg:px-6 py-2 lg:py-3 font-black text-xs sm:text-sm tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
                      style={{ borderRadius: "0px" }}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#F7F7F5] hover:bg-opacity-10 transition-all"
            aria-label="Toggle menu"
            style={{ borderRadius: "0px" }}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-[#F7F7F5] transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-[#F7F7F5] transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-[#F7F7F5] transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(18, 18, 18, 0.3)" }}
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#121212] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "-4px 0 12px rgba(0,0,0,0.3)" }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={closeMobileMenu}
            className="p-2 hover:bg-[#F7F7F5] hover:bg-opacity-10 transition-all"
            aria-label="Close menu"
            style={{ borderRadius: "0px" }}
          >
            <svg
              className="w-6 h-6 text-[#F7F7F5]"
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col px-4 py-2 space-y-1">
          {isAuthenticated && isAdmin ? (
            <>
              {/* Admin Badge */}
              <div className="px-4 py-2">
                <div className="bg-[#E9B60A] px-3 py-1 inline-block">
                  <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
                    Admin Panel
                  </span>
                </div>
              </div>

              {/* Orders Management */}
              <Link
                href="/admin/orders"
                onClick={closeMobileMenu}
                className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left"
                style={{ borderRadius: "0px" }}
              >
                Orders
              </Link>

              {/* Divider */}
              <div className="h-[1px] bg-[#F7F7F5] opacity-20 my-2"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left w-full"
                style={{ borderRadius: "0px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/menu"
                onClick={closeMobileMenu}
                className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left"
                style={{ borderRadius: "0px" }}
              >
                Menu
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="relative px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left flex items-center justify-between"
                    style={{ borderRadius: "0px" }}
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span
                        className="bg-[#E9B60A] text-[#121212] text-xs font-black px-2 py-1 ml-2"
                        style={{ borderRadius: "0px" }}
                      >
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left"
                    style={{ borderRadius: "0px" }}
                  >
                    Profile
                  </Link>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#F7F7F5] opacity-20 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left w-full"
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
                    onClick={closeMobileMenu}
                    className="px-4 py-4 font-bold text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212] text-left"
                    style={{ borderRadius: "0px" }}
                  >
                    Login
                  </Link>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#F7F7F5] opacity-20 my-2"></div>

                  {/* Sign Up CTA */}
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="bg-[#E9B60A] text-[#121212] px-4 py-4 font-black text-sm tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 text-center"
                    style={{ borderRadius: "0px" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
