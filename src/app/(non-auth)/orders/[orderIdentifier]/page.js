"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { withAuth } from "@/components/generic/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import OrderTrackingStatus from "@/components/orders-component/OrderTrackingStatus";
import OrderSummary from "@/components/orders-component/OrderSummary";
import OrderItems from "@/components/orders-component/OrderItems";
import OrderActions from "@/components/orders-component/OrderActions";
import LoadingSpinner from "@/components/generic/LoadingSpinner";
import {
  FiArrowLeft,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

function OrderDetailPage() {
  const { orderIdentifier } = useParams();
  const { authenticatedFetch } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderIdentifier) {
      loadOrderDetails();
    }
  }, [orderIdentifier]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try both endpoints - first by order number, then by ID
      let response;

      // Check if orderIdentifier looks like a UUID (contains hyphens)
      const isUUID = orderIdentifier.includes("-");

      if (isUUID) {
        // Try order ID endpoint first
        response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderIdentifier}/`
        );

        // If that fails, try tracking endpoint
        if (!response.ok) {
          response = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/track/${orderIdentifier}/`
          );
        }
      } else {
        // Try tracking endpoint first for order numbers
        response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/track/${orderIdentifier}/`
        );

        // If that fails, try order ID endpoint
        if (!response.ok) {
          response = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderIdentifier}/`
          );
        }
      }

      if (response.ok) {
        const result = await response.json();
        setOrder(result.data);
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      setError(
        "Failed to load order details. The order may not exist or you may not have permission to view it."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) / 100;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner fullScreen message="Loading order details..." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <FiAlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Not Found
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>
                <button
                  onClick={() => router.push("/account?tab=orders")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors py-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadOrderDetails}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh order details"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <OrderActions order={order} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            <OrderTrackingStatus order={order} />

            {/* Order Items */}
            <OrderItems items={order.items} formatCurrency={formatCurrency} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <OrderSummary
              order={order}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(OrderDetailPage);
