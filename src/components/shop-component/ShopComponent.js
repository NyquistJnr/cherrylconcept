"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams();

  // Add parameters to search params if they exist
  if (params.search) searchParams.append("search", params.search);
  if (params.price_min) searchParams.append("price_min", params.price_min);
  if (params.price_max) searchParams.append("price_max", params.price_max);
  if (params.rating_min) searchParams.append("rating_min", params.rating_min);
  if (params.colors) searchParams.append("colors", params.colors);
  if (params.sizes) searchParams.append("sizes", params.sizes);
  if (params.is_new !== undefined) searchParams.append("is_new", params.is_new);
  if (params.is_popular !== undefined)
    searchParams.append("is_popular", params.is_popular);
  if (params.is_trending !== undefined)
    searchParams.append("is_trending", params.is_trending);
  if (params.is_best_seller !== undefined)
    searchParams.append("is_best_seller", params.is_best_seller);
  if (params.ordering) searchParams.append("ordering", params.ordering);
  if (params.category) searchParams.append("category", params.category);

  const url = `${API_BASE_URL}/products/?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] }; // Return empty array on error
  }
}

const priceRanges = [
  { id: "all", name: "All Prices", min: null, max: null },
  { id: "under-25000", name: "Under ₦25,000", min: null, max: 25000 },
  { id: "25000-50000", name: "₦25,000 - ₦50,000", min: 25000, max: 50000 },
  { id: "50000-100000", name: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { id: "over-100000", name: "Over ₦100,000", min: 100000, max: null },
];

const sortOptions = [
  { id: "featured", name: "Featured", value: "" },
  { id: "price-low", name: "Price: Low to High", value: "price" },
  { id: "price-high", name: "Price: High to Low", value: "-price" },
  { id: "popularity", name: "Most Popular", value: "-reviews_count" },
  { id: "newest", name: "Newest First", value: "-created_at" },
  { id: "rating", name: "Highest Rated", value: "-rating" },
];

export default function ProductListingPage({
  initialProducts,
  initialCategories,
}) {
  const [products, setProducts] = useState(initialProducts?.data || []);
  const [categories, setCategories] = useState(initialCategories?.data || []);
  const [totalCount, setTotalCount] = useState(initialProducts?.count || 0);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart context
  const { addToCart } = useCart();

  // Fetch products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {};

        // Apply filters
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== "all") params.category = selectedCategory;

        // Apply price range
        if (selectedPriceRange !== "all") {
          const range = priceRanges.find((r) => r.id === selectedPriceRange);
          if (range.min) params.price_min = range.min;
          if (range.max) params.price_max = range.max;
        }

        // Apply sorting
        const sortOption = sortOptions.find((s) => s.id === sortBy);
        if (sortOption?.value) params.ordering = sortOption.value;

        const response = await fetchProducts(params);
        setProducts(response.data || []);
        setTotalCount(response.count || 0);

        const responseCategories = await fetchCategories();
        setCategories(responseCategories.data || []);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscountPercentage = (price, originalPrice) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">({reviews})</span>
    </div>
  );

  const handleAddToCart = async (product, e) => {
    e.stopPropagation(); // Prevent any parent click handlers

    try {
      await addToCart(
        product,
        product.colors?.[0] || "", // Default to first color
        product.sizes?.[0] || "", // Default to first size
        1 // Default quantity
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const ProductCard = ({ product, isListView = false }) => {
    const discountPercentage = product.discount_percentage || 0;

    return (
      <div
        className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isListView ? "flex h-48" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            isListView ? "w-48 flex-shrink-0" : "aspect-square"
          }`}
        >
          {product.is_new && (
            <span className="absolute top-3 left-3 z-10 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {product.is_popular && (
            <span className="absolute top-3 right-3 z-10 bg-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
              Popular
            </span>
          )}
          {product.is_trending && (
            <span className="absolute top-12 right-3 z-10 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
              Trending
            </span>
          )}
          {product.is_best_seller && (
            <span className="absolute top-12 left-3 z-10 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
              Best Seller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="absolute bottom-3 left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              -{Math.round(discountPercentage)}%
            </span>
          )}
          <Link href={`/shop/${product.id}`}>
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <button
            onClick={() => setQuickViewProduct(product)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg">
              Quick View
            </span>
          </button>
        </div>

        <div
          className={`p-6 ${
            isListView ? "flex-1 flex flex-col justify-between" : ""
          }`}
        >
          <div>
            <Link href={`/shop/${product.id}`}>
              <span className="text-sm text-purple-600 font-medium">
                {product.category_name}
              </span>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <StarRating
              rating={parseFloat(product.rating)}
              reviews={product.reviews_count}
            />
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {isListView && (
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Colors: {product.colors?.length || 0}</span>
                  <span>Sizes: {product.sizes?.length || 0}</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => handleAddToCart(product, e)}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const QuickViewModal = ({ product, onClose }) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
      if (product) {
        setSelectedColor(product.colors?.[0] || "");
        setSelectedSize(product.sizes?.[0] || "");
        setQuantity(1);
      }
    }, [product]);

    if (!product) return null;

    const getColorStyle = (color) => {
      const colorMap = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#10b981",
        yellow: "#f59e0b",
        purple: "#8b5cf6",
        pink: "#ec4899",
        orange: "#f97316",
        black: "#000000",
        white: "#ffffff",
        gray: "#6b7280",
        brown: "#92400e",
        navy: "#1e3a8a",
        beige: "#f5f5dc",
      };
      return colorMap[color.toLowerCase()] || "#6b7280";
    };

    const handleQuickAddToCart = async () => {
      try {
        await addToCart(product, selectedColor, selectedSize, quantity);
        onClose(); // Close modal after adding to cart
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Quick View</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square relative rounded-xl overflow-hidden">
              <Image
                src={product.main_image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm text-purple-600 font-medium">
                {product.category_name}
              </span>
              <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
              <StarRating
                rating={parseFloat(product.rating)}
                reviews={product.reviews_count}
              />
              <div className="flex items-center space-x-2 my-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Product badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.is_new && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full">
                    New
                  </span>
                )}
                {product.is_popular && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium rounded-full">
                    Popular
                  </span>
                )}
                {product.is_trending && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 text-sm font-medium rounded-full">
                    Trending
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium rounded-full">
                    Best Seller
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Available Colors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors shadow-sm ${
                            selectedColor === color
                              ? "border-purple-500 ring-2 ring-purple-200"
                              : "border-gray-300 hover:border-purple-500"
                          }`}
                          style={{ backgroundColor: getColorStyle(color) }}
                          title={color.charAt(0).toUpperCase() + color.slice(1)}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Available Sizes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                            selectedSize === size
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h4 className="font-semibold mb-2">Quantity:</h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="font-medium w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleQuickAddToCart}
                  className="flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  href={`/shop/${product.id}`}
                  className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <main className="pt-28 min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Cherryl Concept
              </h1>
              <p className="text-xl opacity-90">
                Discover our premium selection of hats, caps, wigs, and
                accessories for every style and occasion
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedPriceRange("all");
                      setSearchQuery("");
                    }}
                    className="text-purple-600 text-sm font-medium hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === "all"
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>All Products</span>
                        <span className="text-sm text-gray-500">
                          ({totalCount})
                        </span>
                      </div>
                    </button>
                    {categories && categories.length > 0 ? (
                      categories
                        .filter((category) => category.is_active)
                        .map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? "bg-purple-100 text-purple-700 font-medium"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category.name}</span>
                              <span className="text-sm text-gray-500">
                                ({category.products_count})
                              </span>
                            </div>
                          </button>
                        ))
                    ) : (
                      <div className="text-sm text-gray-500 px-3 py-2">
                        Loading categories...
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedPriceRange === range.id
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium"
                    >
                      Filters
                    </button>
                    <span className="text-gray-600">
                      {loading
                        ? "Loading..."
                        : `Showing ${products.length} of ${totalCount} products`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
                    >
                      <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && products.length === 0 && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.93-6.072-2.44m0 0L5 13m.928-.69A7.962 7.962 0 014 12c0-1.21.25-2.36.7-3.4M5 13l-.928.69M19 13l-.928-.69M19 13l.928.69"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedPriceRange("all");
                        setSearchQuery("");
                      }}
                      className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

// Server-side rendering
export async function getServerSideProps(context) {
  try {
    // Fetch initial data on the server
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    return {
      props: {
        initialProducts: productsResponse,
        initialCategories: categoriesResponse,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialProducts: { data: [], count: 0 },
        initialCategories: { data: [] },
      },
    };
  }
}
