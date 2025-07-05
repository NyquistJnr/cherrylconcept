"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartComponent() {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const router = useRouter();

  // Get cart data and functions from context
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
  } = useCart();

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1);
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(0.2);
    } else {
      alert("Invalid promo code");
    }
  };

  const { subtotal, itemCount, shipping, tax } = getCartTotals();
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + shipping + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <main className="pt-28 min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7.5"
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet
              </p>
              <Link
                href="/shop"
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="pt-28 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Shopping Cart
                </h1>
                <p className="text-gray-600">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                </p>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            href={`/shop/${item.productId}`}
                            className="hover:text-purple-600 transition-colors"
                          >
                            <h3 className="font-semibold text-lg text-gray-900">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="text-sm text-gray-500 space-y-1">
                            {item.category && <p>Category: {item.category}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                            {item.size && <p>Size: {item.size}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
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

                      <div className="flex justify-between items-center">
                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
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
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ Promo code applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      Add {formatPrice(50000 - subtotal)} more for free
                      shipping!
                    </p>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mb-4"
                >
                  Proceed to Checkout
                </button>

                {/* Quick Actions */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={clearCart}
                    className="w-full border border-red-300 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/shop"
                    className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">We accept</p>
                  <div className="flex justify-center space-x-3">
                    {["💳", "🏦", "📱", "💰"].map((icon, index) => (
                      <div
                        key={index}
                        className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                </div>

                {/* Cart Summary Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Cart Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Items in cart:</span>
                      <span>{itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique products:</span>
                      <span>{cartItems.length}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You're saving:</span>
                        <span>{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed or Recommended Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You might also like
            </h2>
            <div className="bg-white rounded-2xl p-6">
              <p className="text-gray-600 text-center">
                Recommended products will appear here based on your cart items.
              </p>
              <div className="text-center mt-4">
                <Link
                  href="/shop"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
