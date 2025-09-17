"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiShoppingBag,
  FiPackage,
  FiHeart,
  FiCheck,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import LoadingSpinner from "../generic/LoadingSpinner";

export default function AccountOverview({ onTabChange }) {
  const { user, authenticatedFetch } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);

      // Load loyalty data
      const loyaltyResponse = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/loyalty/account/`
      );
      if (loyaltyResponse.ok) {
        const loyaltyResult = await loyaltyResponse.json();
        setLoyaltyData(loyaltyResult.data);
      }

      // Load recent orders
      const ordersResponse = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/`
      );
      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        setRecentOrders(ordersResult.data?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error("Error loading overview data:", error);
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
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-[#bbf7d0] text-[#166534]";
      case "shipped":
        return "bg-[#ede9fe] text-[#5b21b6]";
      case "pending":
      case "processing":
        return "bg-[#fef9c3] text-[#854d0e]";
      case "confirmed":
        return "bg-[#f3e8ff] text-[#6d28d9]";
      default:
        return "bg-[#f3f4f6] text-[#1f2937]";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotalSpent = () => {
    if (!loyaltyData) return 0;
    // Estimate total spent from points (assuming 1 point per $1 spent)
    return loyaltyData.total_points_earned / 100;
  };

  if (loading) {
    return <LoadingSpinner message="Loading account overview..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Account Overview
        </h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="opacity-90">
            {loyaltyData ? (
              <>
                You've earned {loyaltyData.total_points_earned.toLocaleString()}{" "}
                points
                {loyaltyData.tier && ` and reached ${loyaltyData.tier} status`}
              </>
            ) : (
              "Thank you for being a valued member"
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/shop"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiShoppingBag className="w-6 h-6 text-purple-600" />
            <span className="font-medium">Shop Now</span>
          </Link>
          <button
            onClick={() => onTabChange("orders")}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiPackage className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Track Orders</span>
          </button>
          <button
            onClick={() => onTabChange("wishlist")}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHeart className="w-6 h-6 text-red-600" />
            <span className="font-medium">View Wishlist</span>
          </button>
        </div>

        {/* Account Stats */}
        {loyaltyData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {loyaltyData.current_balance.toLocaleString()}
              </div>
              <div className="text-gray-600">Available Points</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {loyaltyData.total_points_earned.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Points Earned</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loyaltyData.tier || "Member"}
              </div>
              <div className="text-gray-600">Current Tier</div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => onTabChange("orders")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No orders yet</p>
              <Link
                href="/shop"
                className="inline-block mt-2 text-purple-600 hover:text-purple-700"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        #{order.order_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items_count} item
                        {order.items_count > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loyalty Points Summary */}
        {loyaltyData?.recent_transactions &&
          loyaltyData.recent_transactions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recent Point Activity
              </h3>
              <div className="space-y-2">
                {loyaltyData.recent_transactions
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                      <div
                        className={`font-medium ${
                          transaction.transaction_type === "earned"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "earned" ? "+" : "-"}
                        {transaction.points.toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
