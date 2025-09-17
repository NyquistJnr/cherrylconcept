"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const QuickViewModal = ({ product, onClose }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const getColorStyle = (color) => {
    // (Your getColorStyle function remains the same)
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
      onClose();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking the overlay
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
        >
          {/* This motion.div prevents click propagation to the overlay */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-h-[85vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl sm:max-w-4xl flex flex-col"
          >
            {/* --- Mobile Grabber Handle --- */}
            <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden" />

            {/* --- Sticky Header --- */}
            <header className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl sm:text-2xl font-bold">Quick View</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
                aria-label="Close quick view"
              >
                <X className="w-6 h-6" />
              </button>
            </header>

            {/* --- Scrollable Content --- */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Product Image */}
                <div className="aspect-square relative rounded-xl overflow-hidden">
                  <Image
                    src={product.main_image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-purple-600 font-medium">
                      {product.category_name}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold">
                      {product.name}
                    </h3>
                    <div className="mt-2">
                      <StarRating
                        rating={parseFloat(product.rating)}
                        reviews={product.reviews_count}
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">
                        Color:{" "}
                        <span className="font-normal text-gray-600">
                          {selectedColor}
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                              selectedColor === color
                                ? "border-purple-500 ring-2 ring-purple-200 scale-110"
                                : "border-gray-300 hover:border-purple-400"
                            }`}
                            style={{ backgroundColor: getColorStyle(color) }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Size:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-1.5 border rounded-lg font-medium transition-colors text-sm ${
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
                </div>
              </div>
            </div>

            {/* --- Sticky Footer --- */}
            <footer className="flex-shrink-0 p-4 sm:p-6 border-t bg-white sticky bottom-0 z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-3 border border-gray-300 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {/* Action Buttons */}
                <div className="w-full flex-grow flex space-x-4">
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
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const StarRating = ({ rating, reviews }) => (
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
