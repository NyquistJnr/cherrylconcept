"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiCheck,
  FiEye,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import LoadingSpinner from "../generic/LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderHistory() {
  const { authenticatedFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all");

  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/`
      );

      if (response.ok) {
        const result = await response.json();
        setOrders(result.data || []);
      } else {
        throw new Error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FiCheck className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "pending":
      case "processing":
        return <FiClock className="text-yellow-500" />;
      case "confirmed":
        return <FiPackage className="text-purple-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-[#dcfce7] text-[#15803d]";
      case "shipped":
        return "bg-[#e0e7ff] text-[#3730a3]";
      case "pending":
      case "processing":
        return "bg-[#fef9c3] text-[#854d0e]";
      case "confirmed":
        return "bg-[#ede9fe] text-[#6d28d9]";
      default:
        return "bg-[#f3f4f6] text-[#1f2937]";
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) / 100; // Convert from cents
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filterOrdersByPeriod = (orders) => {
    if (filterPeriod === "all") return orders;

    const now = new Date();
    const cutoffDate = new Date();

    switch (filterPeriod) {
      case "30days":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "6months":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.created_at) >= cutoffDate);
  };

  const filteredOrders = filterOrdersByPeriod(orders);

  const handleViewOrder = (orderNumber) => {
    // Navigate to order details page
    console.log("View order:", orderNumber);
    router.push(`/orders/${orderNumber}`);
  };

  const handleTrackOrder = (orderNumber) => {
    // Navigate to tracking page
    console.log("Track order:", orderNumber);
    router.push(`/orders/${orderNumber}`);
  };

  const handleDownloadInvoice = (orderNumber) => {
    // Download invoice
    console.log("Download invoice for:", orderNumber);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Orders</option>
            <option value="30days">Last 30 days</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
          <button
            onClick={loadOrders}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh orders"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filterPeriod === "all"
              ? "No orders yet"
              : "No orders in this period"}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterPeriod === "all"
              ? "Start shopping to see your orders here"
              : "Try selecting a different time period"}
          </p>
          {filterPeriod === "all" && (
            <Link
              href="/shop"
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      #{order.order_number}
                    </div>
                    <div className="text-gray-600">
                      Placed on {formatDate(order.created_at)}
                    </div>
                    <div className="text-gray-600">
                      {order.items_count} item{order.items_count > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <div className="text-right">
                    <div className="font-semibold text-lg text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleViewOrder(order.order_number)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                {(order.status === "shipped" ||
                  order.status === "confirmed") && (
                  <button
                    onClick={() => handleTrackOrder(order.order_number)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FiTruck className="w-4 h-4" />
                    <span>Track Package</span>
                  </button>
                )}

                <button
                  onClick={() => handleDownloadInvoice(order.order_number)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredOrders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  filteredOrders.reduce(
                    (sum, order) => sum + parseFloat(order.total_amount),
                    0
                  )
                )}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredOrders.reduce(
                  (sum, order) => sum + order.items_count,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Items Purchased</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
