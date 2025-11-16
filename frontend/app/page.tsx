import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Accent Tag */}
            <div className="inline-block mb-4 sm:mb-6">
              <div className="bg-[#E9B60A] px-4 sm:px-6 py-2">
                <span className="text-[#121212] font-bold text-xs tracking-[0.2em] uppercase">
                  Pickup Only
                </span>
              </div>
            </div>

            {/* Hero Heading */}
            <h1
              className="text-[clamp(32px,8vw,64px)] font-bold text-[#121212] leading-[0.95] mb-4 sm:mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Premium Coffee,
              <br />
              Ready When You Are.
            </h1>

            {/* Subheading */}
            <p
              className="text-base sm:text-lg text-[#121212] opacity-70 mb-8 sm:mb-10 max-w-2xl mx-auto"
              style={{ lineHeight: "1.7" }}
            >
              Order ahead and pick up your freshly crafted beverages at your
              convenience. No waiting, no delivery fees - just great coffee.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu">
                <button
                  className="w-full sm:w-auto bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                  style={{ borderRadius: "0px" }}
                >
                  Browse Menu
                </button>
              </Link>
              <Link href="/register">
                <button
                  className="w-full sm:w-auto bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all cursor-pointer"
                  style={{ borderRadius: "0px" }}
                >
                  Sign Up Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="mb-10 sm:mb-12 flex items-center gap-4 sm:gap-6">
          <div className="h-[2px] w-12 sm:w-16 bg-[#121212] opacity-20"></div>
          <p className="text-xs sm:text-sm font-bold text-[#121212] opacity-40 tracking-[0.15em] uppercase whitespace-nowrap">
            Why Brewhub
          </p>
          <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
        </div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 transition-all hover:translate-y-[-8px]"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="mb-4 sm:mb-6">
              <div className="bg-[#E9B60A] w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">☕</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#121212] mb-3 tracking-tight">
              Premium Coffee
            </h3>
            <p
              className="text-sm sm:text-base text-[#121212] opacity-70"
              style={{ lineHeight: "1.7" }}
            >
              Carefully selected beans from the best sources around the world,
              expertly roasted and crafted.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 transition-all hover:translate-y-[-8px]"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="mb-4 sm:mb-6">
              <div className="bg-[#4AA5A2] w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">⏱️</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#121212] mb-3 tracking-tight">
              Quick Pickup
            </h3>
            <p
              className="text-sm sm:text-base text-[#121212] opacity-70"
              style={{ lineHeight: "1.7" }}
            >
              Order ahead and skip the line. Your coffee will be ready when you
              arrive, no waiting required.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="bg-[#F7F7F5] p-6 sm:p-8 transition-all hover:translate-y-[-8px]"
            style={{
              borderRadius: "0px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="mb-4 sm:mb-6">
              <div className="bg-[#E97F8A] w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">💳</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#121212] mb-3 tracking-tight">
              Easy Payment
            </h3>
            <p
              className="text-sm sm:text-base text-[#121212] opacity-70"
              style={{ lineHeight: "1.7" }}
            >
              Secure and convenient payment options. Pay in advance and grab
              your order hassle-free.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
