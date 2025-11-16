"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const { register, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/menu");
    }
  }, [isAuthenticated, router]);

  // Validate password strength
  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordStrong()) {
      toast.error("Please meet all password requirements");
      return;
    }

    try {
      await register(formData);
      toast.success(
        "Registration successful! Check your email for confirmation.",
      );
      router.push("/menu");
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[600px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
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
              Join BrewHub
            </h1>
            <p className="text-sm sm:text-base text-[#121212] opacity-60">
              Create your account and start exploring our coffee collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="John Doe"
                style={{ borderRadius: "0px" }}
              />
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="your@email.com"
                style={{ borderRadius: "0px" }}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Phone Number <span className="opacity-50">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="+1234567890"
                style={{ borderRadius: "0px" }}
              />
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Address <span className="opacity-50">(Optional)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30 resize-none"
                placeholder="123 Main St, City, Country"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordRequirements(true)}
                required
                minLength={8}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 focus:outline-none transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                placeholder="••••••••"
                style={{ borderRadius: "0px" }}
              />

              {/* Password Requirements */}
              {showPasswordRequirements && formData.password && (
                <div
                  className="mt-4 p-4 sm:p-5 bg-white border-2 border-[#121212] border-opacity-10"
                  style={{ borderRadius: "0px" }}
                >
                  <p className="text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                    Password Requirements:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                          passwordStrength.minLength
                            ? "bg-[#121212] text-[#F7F7F5]"
                            : "bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {passwordStrength.minLength ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs sm:text-sm ${
                          passwordStrength.minLength
                            ? "text-[#121212] opacity-100 font-semibold"
                            : "text-[#121212] opacity-50"
                        }`}
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                          passwordStrength.hasUpperCase
                            ? "bg-[#121212] text-[#F7F7F5]"
                            : "bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {passwordStrength.hasUpperCase ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs sm:text-sm ${
                          passwordStrength.hasUpperCase
                            ? "text-[#121212] opacity-100 font-semibold"
                            : "text-[#121212] opacity-50"
                        }`}
                      >
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                          passwordStrength.hasLowerCase
                            ? "bg-[#121212] text-[#F7F7F5]"
                            : "bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {passwordStrength.hasLowerCase ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs sm:text-sm ${
                          passwordStrength.hasLowerCase
                            ? "text-[#121212] opacity-100 font-semibold"
                            : "text-[#121212] opacity-50"
                        }`}
                      >
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                          passwordStrength.hasNumber
                            ? "bg-[#121212] text-[#F7F7F5]"
                            : "bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {passwordStrength.hasNumber ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs sm:text-sm ${
                          passwordStrength.hasNumber
                            ? "text-[#121212] opacity-100 font-semibold"
                            : "text-[#121212] opacity-50"
                        }`}
                      >
                        One number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                          passwordStrength.hasSpecialChar
                            ? "bg-[#121212] text-[#F7F7F5]"
                            : "bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {passwordStrength.hasSpecialChar ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs sm:text-sm ${
                          passwordStrength.hasSpecialChar
                            ? "text-[#121212] opacity-100 font-semibold"
                            : "text-[#121212] opacity-50"
                        }`}
                      >
                        One special character (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                minLength={8}
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
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
            <p className="text-xs font-bold text-[#121212] opacity-40 tracking-[0.15em] uppercase whitespace-nowrap">
              Already a Member?
            </p>
            <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-[#121212] opacity-60 mb-4">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="inline-block bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              LOGIN
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
