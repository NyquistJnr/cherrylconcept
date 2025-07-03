"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const allProducts = [
  {
    id: 1,
    name: "Classic Baseball Cap",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/hairs/7.jpg",
    category: "caps",
    colors: ["black", "navy", "white", "red"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 128,
    isNew: false,
    isPopular: true,
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    name: "Luxury Fedora Hat",
    price: 89.99,
    image: "/images/hairs/8.jpg",
    category: "hats",
    colors: ["black", "brown", "gray"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviews: 45,
    isNew: true,
    isPopular: false,
    dateAdded: "2024-06-01",
  },
  {
    id: 3,
    name: "Silk Headband Set",
    price: 24.99,
    image: "/images/hairs/21.jpg",
    category: "headbands",
    colors: ["multi", "pink", "blue", "gold"],
    sizes: ["One Size"],
    rating: 4.3,
    reviews: 67,
    isNew: false,
    isPopular: true,
    dateAdded: "2024-02-20",
  },
  {
    id: 4,
    name: "Natural Curly Wig",
    price: 149.99,
    originalPrice: 199.99,
    image: "/images/hairs/13.jpg",
    category: "wigs",
    colors: ["brown", "black", "blonde"],
    sizes: ["S", "M", "L"],
    rating: 4.7,
    reviews: 89,
    isNew: false,
    isPopular: true,
    dateAdded: "2024-03-10",
  },
  {
    id: 5,
    name: "Winter Beanie",
    price: 19.99,
    image: "/images/hairs/14.jpg",
    category: "beanies",
    colors: ["black", "gray", "navy", "red"],
    sizes: ["One Size"],
    rating: 4.2,
    reviews: 156,
    isNew: false,
    isPopular: false,
    dateAdded: "2023-11-15",
  },
  {
    id: 6,
    name: "Elegant Sun Hat",
    price: 45.99,
    image: "/images/hairs/18.jpg",
    category: "hats",
    colors: ["beige", "white", "navy"],
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: 92,
    isNew: true,
    isPopular: false,
    dateAdded: "2024-05-20",
  },
  {
    id: 7,
    name: "Sports Visor",
    price: 16.99,
    image: "/images/hairs/15.jpg",
    category: "visors",
    colors: ["white", "black", "pink"],
    sizes: ["One Size"],
    rating: 4.1,
    reviews: 34,
    isNew: false,
    isPopular: false,
    dateAdded: "2024-01-05",
  },
  {
    id: 8,
    name: "Bob Cut Wig",
    price: 129.99,
    image: "/images/hairs/19.jpg",
    category: "wigs",
    colors: ["black", "brown", "blonde", "red"],
    sizes: ["S", "M", "L"],
    rating: 4.4,
    reviews: 73,
    isNew: true,
    isPopular: true,
    dateAdded: "2024-05-30",
  },
];

const categories = [
  { id: "all", name: "All Products", count: allProducts.length },
  {
    id: "hats",
    name: "Hats",
    count: allProducts.filter((p) => p.category === "hats").length,
  },
  {
    id: "caps",
    name: "Caps",
    count: allProducts.filter((p) => p.category === "caps").length,
  },
  {
    id: "headbands",
    name: "Headbands",
    count: allProducts.filter((p) => p.category === "headbands").length,
  },
  {
    id: "wigs",
    name: "Wigs",
    count: allProducts.filter((p) => p.category === "wigs").length,
  },
  {
    id: "beanies",
    name: "Beanies",
    count: allProducts.filter((p) => p.category === "beanies").length,
  },
  {
    id: "visors",
    name: "Visors",
    count: allProducts.filter((p) => p.category === "visors").length,
  },
];

const priceRanges = [
  { id: "all", name: "All Prices", min: 0, max: Infinity },
  { id: "under-25", name: "Under $25", min: 0, max: 25 },
  { id: "25-50", name: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", name: "$50 - $100", min: 50, max: 100 },
  { id: "over-100", name: "Over $100", min: 100, max: Infinity },
];

const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "popularity", name: "Most Popular" },
  { id: "newest", name: "Newest First" },
  { id: "rating", name: "Highest Rated" },
];

export default function ProductListingPage() {
  const [products, setProducts] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.id === selectedPriceRange);
      filtered = filtered.filter(
        (product) => product.price >= range.min && product.price <= range.max
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - sort by popularity and new items first
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.reviews - a.reviews;
        });
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
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

  const ProductCard = ({ product, isListView = false }) => (
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
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
            New
          </span>
        )}
        {product.isPopular && (
          <span className="absolute top-3 right-3 z-10 bg-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
            Popular
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
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
          <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviews={product.reviews} />
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {isListView && (
            <div className="mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Colors: {product.colors.length}</span>
                <span>Sizes: {product.sizes.join(", ")}</span>
              </div>
            </div>
          )}
        </div>
        <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );

  const QuickViewModal = ({ product, onClose }) => {
    if (!product) return null;

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
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
              <StarRating rating={product.rating} reviews={product.reviews} />
              <div className="flex items-center space-x-2 my-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Colors:</h4>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-purple-500 transition-colors"
                        style={{
                          backgroundColor: color === "multi" ? "#ccc" : color,
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sizes:</h4>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button className="flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
                <Link
                  href={`/products/${product.id}`}
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
                Head Wear Collection
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
                    {categories.map((category) => (
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
                            ({category.count})
                          </span>
                        </div>
                      </button>
                    ))}
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
                      Showing {filteredProducts.length} of {allProducts.length}{" "}
                      products
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

              {/* Products Grid/List */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isListView={viewMode === "list"}
                  />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && (
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

              {/* Load More Button */}
              {filteredProducts.length > 0 && (
                <div className="text-center mt-12">
                  <button className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors duration-300">
                    Load More Products
                  </button>
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
