"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";

// Mock wishlist data - replace with API call
const mockWishlistData = [
  {
    id: 1,
    name: "Premium Wool Fedora",
    price: 89.99,
    image: "/images/hairs/8.jpg",
    inStock: true,
    originalPrice: null,
  },
  {
    id: 2,
    name: "Vintage Baseball Cap",
    price: 34.99,
    image: "/images/hairs/7.jpg",
    inStock: true,
    originalPrice: null,
  },
  {
    id: 3,
    name: "Silk Hair Wrap",
    price: 24.99,
    originalPrice: 34.99,
    image: "/images/hairs/21.jpg",
    inStock: false,
  },
];

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistData);
  const [loading, setLoading] = useState(false);

  const removeFromWishlist = async (itemId) => {
    try {
      setLoading(true);
      // Here you would make an API call to remove from wishlist
      // await authenticatedFetch(`/api/wishlist/${itemId}`, { method: 'DELETE' });

      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      setLoading(true);
      // Here you would make an API call to add to cart
      // await authenticatedFetch('/api/cart/add', {
      //   method: 'POST',
      //   body: JSON.stringify({ productId: item.id, quantity: 1 })
      // });

      console.log("Added to cart:", item.name);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Clear All
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <FiHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist
          </p>
          <Link
            href="/shop"
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={loading}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Sale
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock || loading}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                        item.inStock
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>
                        {item.inStock ? "Add to Cart" : "Out of Stock"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Wishlist Actions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Wishlist Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <FiShoppingCart className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FiHeart className="w-4 h-4" />
                <span>Share Wishlist</span>
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              You might also like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mock recommended items */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Recommended Item {item}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">$49.99</span>
                    <button className="text-purple-600 hover:text-purple-700">
                      <FiHeart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
