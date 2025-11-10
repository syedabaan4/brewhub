'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
  });
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { register, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/menu');
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
      toast.error('Passwords do not match');
      return;
    }

    if (!isPasswordStrong()) {
      toast.error('Please meet all password requirements');
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Check your email for confirmation.');
      router.push('/menu');
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#2C1810]">
            Join Brewhub
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="••••••••"
              />
              
              {showPasswordRequirements && formData.password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.minLength ? '✓' : '○'}</span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasUpperCase ? '✓' : '○'}</span>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasLowerCase ? '✓' : '○'}</span>
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasNumber ? '✓' : '○'}</span>
                      One number (0-9)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                      One special character (!@#$%^&*...)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6F4E37] hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

