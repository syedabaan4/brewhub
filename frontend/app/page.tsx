import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#2C1810] mb-4">
            Welcome to Brewhub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your favorite coffee, delivered fresh to your door
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/menu"
              className="btn-primary"
            >
              Browse Menu
            </Link>
            <Link
              href="/register"
              className="btn-secondary"
            >
              Sign Up Now
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">☕</div>
            <h3 className="text-xl font-semibold mb-2">Premium Coffee</h3>
            <p className="text-gray-600">
              Carefully selected beans from the best sources around the world
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your coffee delivered hot and fresh within 30 minutes
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Easy Payment</h3>
            <p className="text-gray-600">
              Secure and convenient payment options for your orders
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
