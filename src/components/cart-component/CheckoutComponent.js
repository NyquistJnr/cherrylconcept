"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../generic/LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckoutComponent = () => {
  const { cartItems, getCartTotals } = useCart();
  const { user, isAuthenticated, authenticatedFetch } = useAuth();
  const { subtotal, itemCount, shipping, tax } = getCartTotals();
  const total = subtotal + shipping + tax;

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    customer_email: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_phone: "",
    shipping_address_line1: "",
    shipping_address_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "Nigeria",
    use_loyalty_points: 0,
    save_shipping_address: false,
    shipping_address_label: "Home",
    use_default_address: false,
    selected_address_id: "",
  });

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`;

  // Initialize form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        customer_email: user.email || "",
        customer_first_name: user.first_name || "",
        customer_last_name: user.last_name || "",
        customer_phone: user.phone_number || "",
      }));
      fetchShippingAddresses();
    }
  }, [isAuthenticated, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setTimeout(() => {
        router.push("/shop");
      }, 2000);
    }
  }, [cartItems]);

  const fetchShippingAddresses = async () => {
    if (!isAuthenticated) return;

    setLoadingAddresses(true);
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/orders/shipping-addresses/`
      );

      if (response.ok) {
        const data = await response.json();
        setShippingAddresses(data.data || []);

        const defaultAddress = data.data?.find((addr) => addr.is_default);
        if (defaultAddress) {
          setFormData((prev) => ({
            ...prev,
            customer_first_name:
              defaultAddress.first_name || prev.customer_first_name,
            customer_last_name:
              defaultAddress.last_name || prev.customer_last_name,
            customer_phone: defaultAddress.phone_number || prev.customer_phone,
            shipping_address_line1: defaultAddress.address_line1 || "",
            shipping_address_line2: defaultAddress.address_line2 || "",
            shipping_city: defaultAddress.city || "",
            shipping_state: defaultAddress.state || "",
            shipping_postal_code: defaultAddress.postal_code || "",
            shipping_country: defaultAddress.country || "Nigeria",
            selected_address_id: defaultAddress.id,
            use_default_address: true,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch shipping addresses:", error);
      toast.error("Failed to load shipping addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => ({
      ...prev,
      customer_first_name: address.first_name || prev.customer_first_name,
      customer_last_name: address.last_name || prev.customer_last_name,
      customer_phone: address.phone_number || prev.customer_phone,
      shipping_address_line1: address.address_line1 || "",
      shipping_address_line2: address.address_line2 || "",
      shipping_city: address.city || "",
      shipping_state: address.state || "",
      shipping_postal_code: address.postal_code || "",
      shipping_country: address.country || "Nigeria",
      selected_address_id: address.id,
      use_default_address: true,
    }));
  };

  const validateForm = () => {
    const required = [
      "customer_email",
      "customer_first_name",
      "customer_last_name",
      "customer_phone",
      "shipping_address_line1",
      "shipping_city",
      "shipping_state",
      "shipping_postal_code",
    ];

    for (let field of required) {
      if (!formData[field]) {
        const fieldName = field
          .replace("_", " ")
          .replace("customer ", "")
          .replace("shipping ", "")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        setError(`Please fill in ${fieldName}`);
        toast.error(`Please fill in ${fieldName}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.customer_phone)) {
      setError("Please enter a valid phone number");
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setLoadingText("Creating Order...");
    setError("");

    try {
      const orderPayload = {
        customer_email: formData.customer_email,
        customer_first_name: formData.customer_first_name,
        customer_last_name: formData.customer_last_name,
        customer_phone: formData.customer_phone,
        shipping_address_line1: formData.shipping_address_line1,
        shipping_address_line2: formData.shipping_address_line2,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_country: formData.shipping_country,
        items: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          color: item.color || "",
          size: item.size || "",
        })),
        use_loyalty_points: parseInt(formData.use_loyalty_points) || 0,
        save_shipping_address: formData.save_shipping_address,
        shipping_address_label: formData.shipping_address_label,
      };

      if (isAuthenticated && formData.use_default_address) {
        orderPayload.use_default_address = true;
        orderPayload.selected_address_id = formData.selected_address_id;
      }

      // Create Order
      let createResponse;
      if (isAuthenticated) {
        createResponse = await authenticatedFetch(
          `${API_BASE}/orders/create/`,
          {
            method: "POST",
            body: JSON.stringify(orderPayload),
          }
        );
      } else {
        createResponse = await fetch(`${API_BASE}/orders/create/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
      }

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.message || "Failed to create order");
      }

      const orderId =
        createData.order_id ||
        createData.data?.order_id ||
        createData.id ||
        createData.data?.id;

      if (!orderId) {
        throw new Error("Order created but no order ID received.");
      }

      // Initialize Payment
      setLoadingText("Initializing Payment...");
      let initResponse;
      if (isAuthenticated) {
        initResponse = await authenticatedFetch(
          `${API_BASE}/orders/payments/initialize/${orderId}/`,
          { method: "POST" }
        );
      } else {
        initResponse = await fetch(
          `${API_BASE}/orders/payments/initialize/${orderId}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const contentType = initResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response from payment server");
      }

      const initData = await initResponse.json();

      if (!initResponse.ok) {
        throw new Error(initData.message || "Failed to initialize payment");
      }

      const authUrl = initData.data?.authorization_url;

      if (!authUrl) {
        throw new Error("Payment URL not provided by gateway");
      }

      // Redirect
      setLoadingText("Redirecting...");
      toast.success("Redirecting to payment gateway...");
      window.location.href = authUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
      toast.error(err.message || "Checkout failed");
      setIsLoading(false);
      setLoadingText("");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!cartItems || cartItems.length === 0) {
    return <LoadingSpinner fullScreen message="Redirecting to shop..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            {isAuthenticated && (
              <div className="text-sm text-green-600 font-medium">
                Logged in as {user?.first_name}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-medium" : ""}
                >
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {formData.use_loyalty_points > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Points Discount</span>
                  <span>-{formatPrice(formData.use_loyalty_points)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      Math.max(0, total - (formData.use_loyalty_points || 0))
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="text-red-600 text-sm font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Guest Checkout Notice */}
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <p className="text-blue-600 text-sm">
                  You're checking out as a guest.
                  <Link
                    href="/login"
                    className="underline hover:no-underline ml-1 font-medium"
                  >
                    Sign in
                  </Link>{" "}
                  to save your details.
                </p>
              </div>
            </div>
          )}

          {/* Main Form Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            {/* Shipping Address Selection (Logged in) */}
            {isAuthenticated && shippingAddresses.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Select Shipping Address</h3>
                {loadingAddresses ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shippingAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="radio"
                          id={address.id}
                          name="selected_address"
                          checked={formData.selected_address_id === address.id}
                          onChange={() => handleAddressSelect(address)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={address.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-sm">
                            <span className="font-medium">
                              {address.full_name} ({address.label})
                            </span>
                            {address.is_default && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                            <div className="text-gray-600">
                              {address.formatted_address}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!formData.use_default_address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          use_default_address: !e.target.checked,
                          selected_address_id: e.target.checked
                            ? ""
                            : prev.selected_address_id,
                        }))
                      }
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">Use new address</span>
                  </label>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isAuthenticated}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="customer_first_name"
                  value={formData.customer_first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="customer_last_name"
                  value={formData.customer_last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Address Form (New Address) */}
            {(!isAuthenticated || !formData.use_default_address) && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Shipping Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="shipping_address_line1"
                    value={formData.shipping_address_line1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="shipping_address_line2"
                    value={formData.shipping_address_line2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
              </div>
            )}

            {/* Save Address Option */}
            {isAuthenticated && (
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="save_shipping_address"
                    checked={formData.save_shipping_address}
                    onChange={handleInputChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">
                    Save this address for future orders
                  </span>
                </label>
                {formData.save_shipping_address && (
                  <div className="ml-6">
                    <input
                      type="text"
                      name="shipping_address_label"
                      value={formData.shipping_address_label}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Address Label (e.g. Home, Work)"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Loyalty Points */}
            {isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Use Loyalty Points
                </label>
                <input
                  type="number"
                  name="use_loyalty_points"
                  value={formData.use_loyalty_points}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter points to redeem"
                />
              </div>
            )}

            {/* UPDATED PAYMENT BUTTON */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 
             px-4 py-2.5 text-white font-semibold text-base shadow-md 
             transition-all duration-300 ease-out
             hover:shadow-xl hover:-translate-y-0.5 
             disabled:pointer-events-none disabled:opacity-60 disabled:transform-none
             focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-40
             md:px-5 md:py-3 md:text-lg
             lg:px-6 lg:py-3.5 lg:text-lg"
            >
              {/* Subtle shine effect on hover */}
              <span
                className="absolute inset-0 translate-x-full bg-white opacity-10 
                   transition-transform duration-700 group-hover:translate-x-0 
                   skew-x-12"
              />

              <div className="relative flex items-center justify-center gap-2 md:gap-3">
                {isLoading ? (
                  <>
                    <div className="relative flex-shrink-0">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white md:h-5 md:w-5" />
                      <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full border-2 border-white/40 md:h-5 md:w-5" />
                    </div>
                    <span className="tracking-wide text-sm md:text-base">
                      {loadingText || "Processing..."}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Amount */}
                    <span className="font-bold tracking-tight text-base md:text-lg">
                      Pay{" "}
                      {formatPrice(
                        Math.max(0, total - (formData.use_loyalty_points || 0))
                      )}
                    </span>

                    {/* Divider */}
                    <div className="h-5 w-px bg-white/30 md:h-6" />

                    {/* Paystack badge */}
                    <div
                      className="flex items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 backdrop-blur-sm 
                        transition-all duration-300 group-hover:bg-white/25
                        md:gap-2 md:px-2.5 md:py-1.5"
                    >
                      {/* "Secured by" text - hidden on mobile, visible on md+ */}
                      <span className="hidden text-xs font-medium text-white/90 md:block md:text-sm">
                        Secured by
                      </span>

                      {/* Paystack logo - always visible */}
                      <img
                        src="/images/paystack.svg"
                        alt="Paystack"
                        className="h-4 w-auto flex-shrink-0 object-contain drop-shadow-sm md:h-5"
                      />
                    </div>

                    {/* Arrow on hover */}
                    <svg
                      className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1
                     md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </div>

              {/* Bottom glow */}
              <div
                className="absolute -bottom-4 left-1/2 h-6 w-32 -translate-x-1/2 rounded-full 
                  bg-gradient-to-r from-emerald-500/30 to-green-600/30 blur-2xl 
                  transition-opacity duration-500 group-hover:opacity-100 opacity-0
                  md:-bottom-6 md:h-8 md:w-40 md:blur-3xl"
              />
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Secured by Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
