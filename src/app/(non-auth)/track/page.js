"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OrderTrackingStatus from "@/components/orders-component/OrderTrackingStatus";
import { FiSearch, FiPackage, FiAlertCircle, FiTruck } from "react-icons/fi";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Public tracking endpoint - doesn't require authentication
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/orders/track/${orderNumber.trim()}/?email=${encodeURIComponent(
          email.trim()
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setOrder(result.data);
        toast.success("Order found!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order not found");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError(
        error.message ||
          "Failed to track order. Please check your order number and email address."
      );
      toast.error("Order not found. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrder(null);
    setError(null);
    setOrderNumber("");
    setEmail("");
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) / 100;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  return (
    <main className="pt-28 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FiTruck className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order details below to track your shipment
            </p>
          </div>

          {!order ? (
            /* Tracking Form */
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPackage className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      placeholder="Enter your order number (e.g., KQHLA1ZW)"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      placeholder="Enter the email used for your order"
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Tracking Order...</span>
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-5 h-5" />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Need help finding your order?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email confirmation for the order number</li>
                  <li>
                    • Make sure to use the same email address used during
                    checkout
                  </li>
                  <li>
                    • Order numbers are usually 8 characters long (e.g.,
                    KQHLA1ZW)
                  </li>
                  <li>
                    • Contact customer support if you continue having issues
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* Order Tracking Results */
            <div className="space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Order #{order.order_number}
                    </h2>
                    <p className="text-gray-600">
                      Ordered by {order.customer_full_name} •{" "}
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Track Another Order
                    </button>
                    {order.customer_email === email && (
                      <button
                        onClick={() =>
                          router.push(`/orders/${order.order_number}`)
                        }
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Full Details
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Status */}
              <OrderTrackingStatus order={order} />

              {/* Order Items Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} •{" "}
                          {formatCurrency(item.product_price)} each
                        </p>
                        {item.color && (
                          <p className="text-sm text-gray-600">
                            Color: {item.color}
                          </p>
                        )}
                        {item.size && (
                          <p className="text-sm text-gray-600">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.line_total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Need additional help?</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Contact Customer Support
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
