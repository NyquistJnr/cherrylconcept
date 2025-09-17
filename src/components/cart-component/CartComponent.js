"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ArrowLeft, Trash2 } from "lucide-react";

export default function CartComponent() {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
  } = useCart();
  const { subtotal, itemCount, shipping, tax } = getCartTotals();

  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + shipping + tax;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") setDiscount(0.1);
    else if (promoCode.toLowerCase() === "welcome20") setDiscount(0.2);
    else alert("Invalid promo code");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
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
              Looks like you haven't added anything to your cart yet.
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
    );
  }

  return (
    <>
      <main className="pt-28 pb-32 lg:pb-0 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                You have {itemCount} item{itemCount !== 1 ? "s" : ""} in your
                cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  formatPrice={formatPrice}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Column (Visible on Desktop) */}
            <aside className="hidden lg:block lg:col-span-1">
              <OrderSummary
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                applyPromoCode={applyPromoCode}
                discount={discount}
                itemCount={itemCount}
                subtotal={subtotal}
                discountAmount={discountAmount}
                shipping={shipping}
                tax={tax}
                total={total}
                formatPrice={formatPrice}
                onCheckout={() => router.push("/checkout")}
                isMobile={false}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile Checkout Footer (Visible on Mobile) */}
      <MobileCheckoutFooter
        total={total}
        formatPrice={formatPrice}
        onCheckout={() => router.push("/checkout")}
      />
    </>
  );
}

// --- Sub-Components for a Cleaner Structure ---

const CartItemCard = ({
  item,
  formatPrice,
  updateQuantity,
  removeFromCart,
}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
    <Link href={`/shop/${item.productId}`} className="flex-shrink-0">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>
    </Link>

    <div className="flex-grow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <Link
            href={`/shop/${item.productId}`}
            className="hover:text-purple-600 transition-colors pr-2"
          >
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight">
              {item.name}
            </h3>
          </Link>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-1">
          {item.color && <span>Color: {item.color}</span>}
          {item.size && <span className="ml-2">Size: {item.size}</span>}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center border border-gray-200 rounded-full">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-full transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-medium w-8 text-center text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-full transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-base sm:text-lg font-bold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  </div>
);

const OrderSummary = ({
  promoCode,
  setPromoCode,
  applyPromoCode,
  discount,
  itemCount,
  subtotal,
  discountAmount,
  shipping,
  tax,
  total,
  formatPrice,
  onCheckout,
  isMobile = false,
}) => (
  <div
    className={
      isMobile ? "" : "bg-white rounded-2xl p-6 shadow-sm sticky top-28"
    }
  >
    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
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
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={applyPromoCode}
          className="bg-gray-900 text-white px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Apply
        </button>
      </div>
      {discount > 0 && (
        <p className="text-green-600 text-sm mt-2">✓ Promo code applied!</p>
      )}
    </div>
    <div className="space-y-3 mb-6 border-t pt-4">
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
        <span>Tax (est.)</span>
        <span>{formatPrice(tax)}</span>
      </div>
    </div>
    <div className="border-t pt-4">
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
    {!isMobile && (
      <button
        onClick={onCheckout}
        className="mt-6 w-full bg-purple-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors"
      >
        Proceed to Checkout
      </button>
    )}
  </div>
);

const MobileCheckoutFooter = ({ total, formatPrice, onCheckout }) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-40">
    <div className="flex items-center justify-between gap-4">
      <div>
        <span className="text-sm text-gray-600">Total</span>
        <p className="text-xl font-bold text-gray-900">{formatPrice(total)}</p>
      </div>
      <button
        onClick={onCheckout}
        className="flex-grow bg-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-purple-700 transition-colors"
      >
        Checkout
      </button>
    </div>
  </div>
);
