"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiExternalLink } from "react-icons/fi";

export default function OrderItems({ items, formatCurrency }) {
  const handleBuyAgain = (item) => {
    // Add to cart functionality
    console.log("Buy again:", item);
  };

  const handleAddToWishlist = (item) => {
    // Add to wishlist functionality
    console.log("Add to wishlist:", item);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
        <span className="text-gray-600">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.product_name}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {item.color && (
                        <p>
                          <span className="font-medium">Color:</span>
                          <span className="ml-1 capitalize">{item.color}</span>
                        </p>
                      )}
                      {item.size && (
                        <p>
                          <span className="font-medium">Size:</span>
                          <span className="ml-1">{item.size}</span>
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Quantity:</span>
                        <span className="ml-1">{item.quantity}</span>
                      </p>
                      <p>
                        <span className="font-medium">Unit Price:</span>
                        <span className="ml-1">
                          {formatCurrency(item.product_price)}
                        </span>
                      </p>
                    </div>

                    {/* Product Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleBuyAgain(item)}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        <span>Buy Again</span>
                      </button>

                      <button
                        onClick={() => handleAddToWishlist(item)}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiHeart className="w-4 h-4" />
                        <span>Add to Wishlist</span>
                      </button>

                      <Link
                        href={`/shop/${item.product_id}`}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>View Product</span>
                      </Link>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="text-right mt-4 sm:mt-0 sm:ml-4">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.line_total)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-sm text-gray-600">
                        {formatCurrency(item.product_price)} each
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Again Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Love these items?
            </h3>
            <p className="text-sm text-gray-600">
              Add all items to your cart for easy reordering
            </p>
          </div>
          <button
            onClick={() => items.forEach(handleBuyAgain)}
            className="mt-3 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Reorder All Items</span>
          </button>
        </div>
      </div>
    </div>
  );
}
