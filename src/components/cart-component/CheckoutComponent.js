"use client";

import React, { useState, useEffect, use } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../generic/LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckoutComponent = () => {
  const { cartItems, getCartTotals, clearCart } = useCart();
  const { user, isAuthenticated, authenticatedFetch } = useAuth();
  const { subtotal, itemCount, shipping, tax } = getCartTotals();
  const total = subtotal + shipping + tax;

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentData, setPaymentData] = useState(null);
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
      // toast.error("Your cart is empty. Redirecting to shop...");
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

        // Pre-fill with default address
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
      } else {
        console.error("Failed to fetch shipping addresses:", response.status);
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

    // Clear errors when user starts typing
    if (error) {
      setError("");
    }
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.customer_phone)) {
      setError("Please enter a valid phone number");
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
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

      // If using existing address for logged-in users
      if (isAuthenticated && formData.use_default_address) {
        orderPayload.use_default_address = true;
        orderPayload.selected_address_id = formData.selected_address_id;
      }

      let response;

      if (isAuthenticated) {
        response = await authenticatedFetch(`${API_BASE}/orders/create/`, {
          method: "POST",
          body: JSON.stringify(orderPayload),
        });
      } else {
        response = await fetch(`${API_BASE}/orders/create/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Order created successfully!");
        toast.success("Order created successfully!");
        setCurrentStep(2);

        // Check the response structure and extract order_id correctly
        console.log("Order creation response:", data);

        // Handle different possible response structures
        const orderId =
          data.order_id || data.data?.order_id || data.id || data.data?.id;

        if (!orderId) {
          console.error("No order ID found in response:", data);
          setError(
            "Order created but no order ID received. Please contact support."
          );
          toast.error(
            "Order created but no order ID received. Please contact support."
          );
          return;
        }

        await initializePayment(orderId);
      } else {
        const errorMessage = data.message || "Failed to create order";
        setError(errorMessage);
        toast.error(errorMessage);

        // Handle specific error cases
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError)) {
            toast.error(firstError[0]);
          } else {
            toast.error(firstError);
          }
        }
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const initializePayment = async (orderId) => {
    if (!orderId) {
      setError("Invalid order ID for payment initialization");
      toast.error("Invalid order ID for payment initialization");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Initializing payment for order ID:", orderId);

      let response;

      if (isAuthenticated) {
        response = await authenticatedFetch(
          `${API_BASE}/orders/payments/initialize/${orderId}/`,
          {
            method: "POST",
          }
        );
      } else {
        response = await fetch(
          `${API_BASE}/orders/payments/initialize/${orderId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Expected JSON response but got ${contentType}. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Payment initialization response:", data);

      if (response.ok) {
        setPaymentData(data.data);
        setCurrentStep(3);
        toast.success("Payment initialized successfully!");
      } else {
        const errorMessage =
          data.message ||
          `Failed to initialize payment. Status: ${response.status}`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);

      let errorMessage = "Failed to initialize payment";

      if (error.message.includes("Unexpected token")) {
        errorMessage =
          "Server returned invalid response. Please check if the payment endpoint exists.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || "Failed to initialize payment";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentData?.authorization_url) {
      // Open payment gateway in new window
      const paymentWindow = window.open(
        paymentData.authorization_url,
        "_blank",
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      setCurrentStep(4);
      toast.info("Complete your payment in the new window");

      // Poll for payment verification
      const pollInterval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(pollInterval);
          verifyPayment(paymentData.reference);
        }
      }, 2000);

      // Auto-verify after 60 seconds if window not closed
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!paymentWindow.closed) {
          verifyPayment(paymentData.reference);
        }
      }, 60000);
    } else {
      toast.error("Payment URL not available");
    }
  };

  const verifyPayment = async (reference) => {
    if (!reference) {
      toast.error("Payment reference not found");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Verifying payment for reference:", reference);

      let response;

      if (isAuthenticated) {
        response = await authenticatedFetch(
          `${API_BASE}/orders/payments/verify/${reference}/`,
          {
            method: "GET",
          }
        );
      } else {
        response = await fetch(
          `${API_BASE}/orders/payments/verify/${reference}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Expected JSON response but got ${contentType}. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Payment verification response:", data);

      if (response.ok) {
        if (data.data && data.data.status === "success") {
          setSuccess("Payment successful! Order confirmed.");
          toast.success("Payment successful! Order confirmed.");
          setCurrentStep(5);
          clearCart(); // Clear cart after successful payment
        } else {
          const errorMessage = `Payment ${data.data?.status || "failed"}: ${
            data.data?.gateway_response || "Unknown error"
          }`;
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        const errorMessage =
          data.message ||
          `Payment verification failed. Status: ${response.status}`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Payment verification error:", error);

      let errorMessage = "Failed to verify payment";

      if (error.message.includes("Unexpected token")) {
        errorMessage =
          "Server returned invalid response. Please check if the verification endpoint exists.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || "Failed to verify payment";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show loading if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return <LoadingSpinner fullScreen message="Redirecting to shop..." />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              {isAuthenticated && (
                <div className="text-sm text-green-600 flex items-center space-x-1">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Logged in as {user?.first_name}</span>
                </div>
              )}
            </div>

            {/* Shipping Address Selection for Logged-in Users */}
            {isAuthenticated && shippingAddresses.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Select Shipping Address</h3>
                {loadingAddresses ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">
                      Loading addresses...
                    </p>
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
                          className="text-purple-600"
                        />
                        <label
                          htmlFor={address.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-sm">
                            <div className="font-medium">
                              {address.full_name} ({address.label})
                              {address.is_default && (
                                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
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
                      className="text-purple-600"
                    />
                    <span className="text-sm">Use new address</span>
                  </label>
                </div>
              </div>
            )}

            {/* Customer Information */}
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
                  placeholder="+234 xxx xxx xxxx"
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

            {/* Shipping Address */}
            {(!isAuthenticated || !formData.use_default_address) && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Shipping Address
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
                    placeholder="Street address, P.O. box, company name"
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
                    placeholder="Apartment, suite, unit, building, floor, etc."
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

            {/* Options */}
            {isAuthenticated && (
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="save_shipping_address"
                    checked={formData.save_shipping_address}
                    onChange={handleInputChange}
                    className="text-purple-600"
                  />
                  <span className="text-sm">
                    Save this shipping address for future orders
                  </span>
                </label>
                {formData.save_shipping_address && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Label
                    </label>
                    <input
                      type="text"
                      name="shipping_address_label"
                      value={formData.shipping_address_label}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Home, Office"
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
                <p className="text-xs text-gray-500 mt-1">
                  Each point = ₦1. Enter 0 to not use points.
                </p>
              </div>
            )}

            <button
              onClick={createOrder}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <span>Create Order</span>
                  <span>({formatPrice(total)})</span>
                </>
              )}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-4">
            <div className="text-green-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order Created Successfully!
            </h2>
            <p className="text-gray-600">Initializing payment...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-semibold">
                  {paymentData?.order_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">
                  {formatPrice(paymentData?.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span className="font-semibold">{paymentData?.currency}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="text-blue-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please complete your payment in the popup window.
            </p>
            <p className="text-sm text-gray-500">Verifying payment status...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <div className="space-y-2">
              <button
                onClick={() => verifyPayment(paymentData?.reference)}
                disabled={isLoading}
                className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Check Payment Status</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">
                Payment window closed? Click above to verify.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="text-green-600 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Order Complete!
            </h2>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed and you
              will receive an email confirmation shortly.
            </p>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Order Details
              </h3>
              <div className="space-y-1 text-sm text-green-700">
                <p>Order Number: {paymentData?.order_number}</p>
                <p>Amount Paid: {formatPrice(paymentData?.amount)}</p>
                <p>
                  Items: {itemCount} item{itemCount !== 1 ? "s" : ""}
                </p>
                <p>Email: {formData.customer_email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/shop")}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Continue Shopping
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => (window.location.href = "/account?tab=orders")}
                  className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  View Orders
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step <= currentStep
                        ? "bg-purple-600 text-white"
                        : step === currentStep + 1
                        ? "bg-purple-200 text-purple-600"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step <= currentStep ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-8 h-1 mx-2 transition-colors ${
                        step < currentStep ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Details</span>
              <span>Creating</span>
              <span>Payment</span>
              <span>Processing</span>
              <span>Complete</span>
            </div>
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

            {/* Cart Items Preview */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Items in your order:
              </h4>
              <div className="space-y-2">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} {item.color && `(${item.color})`}{" "}
                      {item.size && `- ${item.size}`}
                    </span>
                    <span className="font-medium">
                      {item.quantity}x {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{cartItems.length - 3} more item
                    {cartItems.length - 3 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-700 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="text-green-700 font-medium">Success</p>
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Guest Checkout Notice */}
          {!isAuthenticated && currentStep === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-blue-700 font-medium">Guest Checkout</p>
                  <p className="text-blue-600 text-sm">
                    You're checking out as a guest.
                    <Link
                      href="/login"
                      className="underline hover:no-underline ml-1"
                    >
                      Sign in
                    </Link>{" "}
                    or
                    <Link
                      href="/signup"
                      className="underline hover:no-underline ml-1"
                    >
                      create an account
                    </Link>{" "}
                    for faster checkout and order tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
