"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Pagination } from "../generic/Pagination";
import { QuickViewModal, StarRating } from "./QuickViewModal";

// Constants
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

export default function ProductList() {
  // Hooks for URL-based state management
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filters and page from URL, providing defaults
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedPriceRange = searchParams.get("price") || "all";
  const sortBy = searchParams.get("sort") || "featured";
  const currentPage = Number(searchParams.get("page")) || 1;

  const isNew = searchParams.get("is_new") === "true";
  const isPopular = searchParams.get("is_popular") === "true";
  const isTrending = searchParams.get("is_trending") === "true";
  const isBestSeller = searchParams.get("is_best_seller") === "true";

  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [inputValue, setInputValue] = useState(searchQuery); // For debounced search

  const { addToCart } = useCart();

  // Function to update URL params
  const updateUrlParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Use replace to avoid polluting browser history on every filter change
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handlers for filter changes
  const handleFilterChange = (key, value) => {
    updateUrlParams({ [key]: value, page: "1" }); // Reset to page 1 on filter change
  };

  const handleToggleFilter = (key) => {
    const currentValue = searchParams.get(key) === "true";
    updateUrlParams({ [key]: !currentValue ? "true" : null, page: "1" });
  };

  const handleClearFilters = () => {
    router.replace("?", { scroll: false });
  };

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        updateUrlParams({ search: inputValue, page: "1" });
      }
    }, 500); // Wait for 500ms after user stops typing
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, updateUrlParams]);

  // Sync input value if URL search param changes (e.g., back button)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // TanStack Query for Categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const categories = categoriesData?.data || [];

  // TanStack Query for Products
  const productsQuery = useQuery({
    queryKey: [
      "products",
      {
        searchQuery,
        selectedCategory,
        selectedPriceRange,
        sortBy,
        page: currentPage,
        isNew,
        isPopular,
        isTrending,
        isBestSeller,
      },
    ],
    queryFn: () => {
      const params = {
        search: searchQuery,
        page: currentPage,
      };
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedPriceRange !== "all") {
        const range = priceRanges.find((r) => r.id === selectedPriceRange);
        if (range?.min) params.price_min = range.min;
        if (range?.max) params.price_max = range.max;
      }
      const sortOption = sortOptions.find((s) => s.id === sortBy);
      if (sortOption?.value) params.ordering = sortOption.value;

      if (isNew) params.is_new = true;
      if (isPopular) params.is_popular = true;
      if (isTrending) params.is_trending = true;
      if (isBestSeller) params.is_best_seller = true;

      return fetchProducts(params);
    },
    keepPreviousData: true,
  });

  const { isLoading, isError, data: productsData, isFetching } = productsQuery;
  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination || {};
  const totalCount = pagination.total_items || 0;
  const totalPages = pagination.total_pages || 1;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(
        product,
        product.colors?.[0] || "",
        product.sizes?.[0] || "",
        1
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden aspect-square">
        {product.is_new && (
          <span className="absolute top-3 left-3 z-10 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
            New
          </span>
        )}
        {product.discount_percentage > 0 && (
          <span className="absolute bottom-3 left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            -{Math.round(product.discount_percentage)}%
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
      <div className="p-6 flex flex-col">
        <div className="flex-grow">
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
        </div>
        <button
          onClick={(e) => handleAddToCart(product, e)}
          className="w-full mt-auto bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <>
      <main className="pt-28 min-h-screen bg-gray-50">
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
            <aside
              className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={handleClearFilters}
                    className="text-purple-600 text-sm font-medium hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange("category", "all")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === "all"
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>All Products</span>
                      </div>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleFilterChange("category", category.id)
                        }
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
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => handleFilterChange("price", range.id)}
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleFilter("is_new")}
                      className={`px-3 py-1.5 border rounded-full font-medium text-sm transition-colors ${
                        isNew
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      New Arrivals
                    </button>
                    <button
                      onClick={() => handleToggleFilter("is_popular")}
                      className={`px-3 py-1.5 border rounded-full font-medium text-sm transition-colors ${
                        isPopular
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => handleToggleFilter("is_trending")}
                      className={`px-3 py-1.5 border rounded-full font-medium text-sm transition-colors ${
                        isTrending
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      Trending
                    </button>
                    <button
                      onClick={() => handleToggleFilter("is_best_seller")}
                      className={`px-3 py-1.5 border rounded-full font-medium text-sm transition-colors ${
                        isBestSeller
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      Best Sellers
                    </button>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1">
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
                      {isFetching
                        ? "Loading..."
                        : `Showing ${products.length} of ${totalCount} products`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        handleFilterChange("sort", e.target.value)
                      }
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

              {isLoading ? (
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
              ) : isError ? (
                <div className="text-center py-16 text-red-500">
                  Failed to load products.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {!isLoading && !isFetching && products.length === 0 && (
                    <div className="text-center py-16">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  )}

                  {!isLoading && products.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) =>
                        updateUrlParams({ page: String(page) })
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
