// components/account/AccountSidebar.js

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import LoadingSpinner from "../generic/LoadingSpinner";

export default function AccountSidebar({ activeTab, onTabChange }) {
  const { user, logout, authenticatedFetch, initialized, isAuthenticated } =
    useAuth();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: "overview", label: "Account Overview", icon: FiUser },
    { id: "orders", label: "Order History", icon: FiShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "addresses", label: "Addresses", icon: FiMapPin },
    /* { id: "payment", label: "Payment Methods", icon: FiCreditCard }, */
    { id: "settings", label: "Account Settings", icon: FiSettings },
  ];

  useEffect(() => {
    // Only load data when auth is initialized and user is authenticated
    if (initialized && isAuthenticated && user) {
      loadSidebarData();
    } else if (initialized) {
      // Auth is initialized but user is not authenticated
      setLoading(false);
    }
  }, [initialized, isAuthenticated, user]);

  const loadSidebarData = async () => {
    try {
      setLoading(true);

      // Load loyalty data
      try {
        const loyaltyResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/loyalty/account/`
        );
        if (loyaltyResponse.ok) {
          const loyaltyResult = await loyaltyResponse.json();
          setLoyaltyData(loyaltyResult.data);
        }
      } catch (error) {
        console.error("Error loading loyalty data:", error);
        // Don't fail the whole component if loyalty data fails
      }

      // Load orders count
      try {
        const ordersResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/`
        );
        if (ordersResponse.ok) {
          const ordersResult = await ordersResponse.json();
          setOrdersCount(ordersResult.count || 0);
        }
      } catch (error) {
        console.error("Error loading orders data:", error);
        // Don't fail the whole component if orders data fails
      }
    } catch (error) {
      console.error("Error loading sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberSince = () => {
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return "N/A";
  };

  const formatPoints = (points) => {
    if (!points && points !== 0) return "0";
    return points.toLocaleString();
  };

  // Show loading while auth is being checked
  if (!initialized) {
    return (
      <aside className="lg:w-80">
        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
          <LoadingSpinner message="Loading account..." />
        </div>
      </aside>
    );
  }

  // If not authenticated after initialization, don't render sidebar
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <aside className="lg:w-80">
      <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
        {/* User Info */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {user?.full_name || `${user?.first_name} ${user?.last_name}`}
          </h2>
          {user?.username && (
            <p className="text-sm text-gray-500">@{user.username}</p>
          )}
          <p className="text-gray-600">Member since {getMemberSince()}</p>
          {loyaltyData?.tier && (
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                loyaltyData.tier === "Platinum"
                  ? "bg-gray-100 text-gray-800"
                  : loyaltyData.tier === "Gold"
                  ? "bg-yellow-100 text-yellow-800"
                  : loyaltyData.tier === "Silver"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {loyaltyData.tier} Member
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {loading ? "..." : ordersCount}
            </div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : formatPoints(loyaltyData?.current_balance)}
            </div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
