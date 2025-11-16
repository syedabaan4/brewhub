"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/menu");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/menu");
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[480px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div
          className="bg-[#F7F7F5] p-6 sm:p-8 lg:p-10"
          style={{
            borderRadius: "0px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#121212] mb-2"
              style={{ letterSpacing: "-0.01em" }}
            >
              Login to BrewHub
            </h1>
            <p className="text-sm sm:text-base text-[#121212] opacity-60">
              Welcome back! Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="your@email.com"
                style={{ borderRadius: "0px" }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="••••••••"
                style={{ borderRadius: "0px" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ borderRadius: "0px" }}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
            <p className="text-xs font-bold text-[#121212] opacity-40 tracking-[0.15em] uppercase whitespace-nowrap">
              New Here?
            </p>
            <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-[#121212] opacity-60 mb-4">
              Don't have an account yet?
            </p>
            <Link
              href="/register"
              className="inline-block bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
