"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddOnModal from "@/components/AddOnModal";
import { useProductStore, useCartStore, useAuthStore } from "@/lib/store";
import { Product, AddOn } from "@/types";
import toast from "react-hot-toast";

export default function MenuPage() {
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if (product.addons && product.addons.length > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      try {
        await addToCart(product.id, 1);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const handleAddToCartWithAddons = async (
    selectedAddons: AddOn[],
    quantity: number,
  ) => {
    if (!selectedProduct) return;

    try {
      await addToCart(selectedProduct.id, quantity, selectedAddons);
    } catch (error) {
      // Error handled in store
    }
  };

  const accentColors = ["#E9B60A", "#4AA5A2", "#E97F8A", "#3973B8"];
  const getAccentColor = (index: number) =>
    accentColors[index % accentColors.length];

  return (
    <div className="min-h-screen bg-[#EDECE8]">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Compact Hero Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <div className="inline-block mb-3 sm:mb-4">
                <div className="bg-[#E9B60A] px-4 sm:px-6 py-2">
                  <span className="text-[#121212] font-bold text-xs tracking-[0.2em] uppercase">
                    Menu
                  </span>
                </div>
              </div>
              <h1
                className="text-[clamp(32px,8vw,64px)] font-bold text-[#121212] leading-[0.95] mb-3 sm:mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                Discover
                <br />
                your Brew.
              </h1>
              <p
                className="text-sm sm:text-base text-[#121212] opacity-70 max-w-md leading-relaxed"
                style={{ lineHeight: "1.7" }}
              >
                Handcrafted beverages made with passion, sourced from
                <br />
                the finest ingredients.
              </p>
            </div>

            {/* Right: Search & Filters */}
            <div className="flex-1 lg:max-w-3xl">
              <div
                className="bg-[#F7F7F5] p-5 sm:p-6 lg:p-8"
                style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
              >
                {/* Search Bar */}
                <div className="mb-5 sm:mb-6">
                  <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="find your favorite..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212] text-sm sm:text-base placeholder-[#121212] placeholder-opacity-30"
                      style={{ borderRadius: "0px" }}
                    />
                    <svg
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#121212] opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Categories Horizontal */}
                <div>
                  <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 sm:px-5 py-2 sm:py-3 font-bold transition-all border-2 text-xs sm:text-sm ${
                          selectedCategory === category
                            ? "bg-[#121212] text-[#F7F7F5] border-[#121212]"
                            : "bg-white text-[#121212] border-transparent hover:border-[#121212] hover:border-opacity-20"
                        }`}
                        style={{ borderRadius: "0px", letterSpacing: "0.03em" }}
                      >
                        {category.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mb-6 sm:mb-8 flex items-center gap-4 sm:gap-6">
            <div className="h-[2px] w-12 sm:w-16 bg-[#121212] opacity-20"></div>
            <p className="text-xs sm:text-sm font-bold text-[#121212] opacity-40 tracking-[0.15em] uppercase whitespace-nowrap">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"}
            </p>
            <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 sm:py-32">
            <div
              className="inline-block bg-[#F7F7F5] px-8 sm:px-12 py-6 sm:py-8"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p className="text-xl sm:text-2xl text-[#121212] opacity-60 font-bold tracking-wide">
                LOADING...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <div
              className="inline-block bg-[#F7F7F5] px-10 sm:px-16 py-8 sm:py-12"
              style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.06)" }}
            >
              <p className="text-2xl sm:text-3xl text-[#121212] font-bold mb-3 sm:mb-4 tracking-tight">
                {searchTerm ? "No matches found" : "No products available"}
              </p>
              {searchTerm && (
                <p className="text-[#121212] opacity-50 text-base sm:text-lg">
                  Try adjusting your search
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5 lg:gap-7">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group overflow-hidden bg-[#F7F7F5] transition-all hover:translate-y-[-8px] ${
                  !product.available ? "opacity-50" : ""
                }`}
                style={{
                  borderRadius: "0px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Product Image - Very compact for mobile */}
                <div
                  className="relative aspect-[4/3.2] sm:aspect-[4/3.5] lg:aspect-[4/4] flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: getAccentColor(index) }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-[40px] sm:text-[80px] lg:text-[100px] opacity-15 select-none">
                      ☕
                    </div>
                  )}

                  {!product.available && (
                    <div className="absolute inset-0 bg-[#121212] bg-opacity-40 flex items-center justify-center">
                      <div className="bg-[#121212] px-2 sm:px-4 py-1 sm:py-2">
                        <span className="text-[#F7F7F5] font-black text-[8px] sm:text-[10px] tracking-[0.15em]">
                          SOLD OUT
                        </span>
                      </div>
                    </div>
                  )}

                  
                </div>

                {/* Product Details */}
                <div className="p-2 sm:p-4 lg:p-5 flex flex-col min-h-[110px] sm:min-h-[180px] lg:min-h-[220px]">
                  <h3
                    className={`text-xs sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1.5 lg:mb-2 leading-tight ${
                      !product.available
                        ? "text-[#121212] opacity-40"
                        : "text-[#121212]"
                    }`}
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {product.name}
                  </h3>

                  <p
                    className="text-[8px] sm:text-[11px] lg:text-xs text-[#121212] opacity-60 leading-tight line-clamp-2 flex-1"
                    style={{ lineHeight: "1.3" }}
                  >
                    {product.description}
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-end justify-between gap-1.5 sm:gap-3 lg:gap-4 mt-2 sm:mt-4 lg:mt-6">
                    <div>
                      <div className="text-[7px] sm:text-[9px] lg:text-[10px] font-bold text-[#121212] opacity-40 tracking-[0.08em] uppercase mb-0.5 sm:mb-1 lg:mb-1.5">
                        Price
                      </div>
                      <div
                        className={`text-base sm:text-2xl lg:text-3xl font-black ${
                          !product.available
                            ? "text-[#121212] opacity-30"
                            : "text-[#121212]"
                        }`}
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    {product.available ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 font-black text-[8px] sm:text-[10px] lg:text-xs tracking-[0.12em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
                        style={{ borderRadius: "0px" }}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-[#121212] bg-opacity-10 text-[#121212] text-opacity-30 px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 font-black text-[8px] sm:text-[10px] lg:text-xs tracking-[0.12em] uppercase cursor-not-allowed"
                        style={{ borderRadius: "0px" }}
                      >
                        N/A
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add-On Modal */}
      {selectedProduct && (
        <AddOnModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCartWithAddons}
        />
      )}
    </div>
  );
}
