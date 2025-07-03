"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiEye,
  FiTrash2,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiMail,
  FiPhone,
  FiBell,
  FiDownload,
} from "react-icons/fi";

// Mock user data
const userData = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/images/hairs/12.jpg",
  memberSince: "March 2023",
  totalOrders: 12,
  totalSpent: 847.32,
  loyaltyPoints: "2,450",
};

// Mock orders data
const ordersData = [
  {
    id: "ORD-001234",
    date: "2024-06-15",
    status: "delivered",
    total: 89.97,
    items: 3,
    image: "/images/hairs/7.jpg",
  },
  {
    id: "ORD-001233",
    date: "2024-06-10",
    status: "shipped",
    total: 129.99,
    items: 2,
    image: "/images/hairs/8.jpg",
  },
  {
    id: "ORD-001232",
    date: "2024-06-05",
    status: "processing",
    total: 45.99,
    items: 1,
    image: "/images/hairs/21.jpg",
  },
];

// Mock wishlist data
const wishlistData = [
  {
    id: 1,
    name: "Premium Wool Fedora",
    price: 89.99,
    image: "/images/hairs/8.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Vintage Baseball Cap",
    price: 34.99,
    image: "/images/hairs/7.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Silk Hair Wrap",
    price: 24.99,
    originalPrice: 34.99,
    image: "/images/hairs/21.jpg",
    inStock: false,
  },
];

// Mock addresses data
const addressesData = [
  {
    id: 1,
    type: "Home",
    name: "Sarah Johnson",
    street: "123 Fashion Avenue",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: 2,
    type: "Work",
    name: "Sarah Johnson",
    street: "456 Business Blvd",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "United States",
    isDefault: false,
  },
];

export default function AccountComponent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(userData);

  const menuItems = [
    { id: "overview", label: "Account Overview", icon: FiUser },
    { id: "orders", label: "Order History", icon: FiShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "addresses", label: "Addresses", icon: FiMapPin },
    { id: "payment", label: "Payment Methods", icon: FiCreditCard },
    { id: "settings", label: "Account Settings", icon: FiSettings },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheck className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "processing":
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleProfileSave = () => {
    setEditingProfile(false);
    // Save profile logic here
  };

  return (
    <>
      <Head>
        <title>My Account | HeadWear Dashboard</title>
        <meta
          name="description"
          content="Manage your HeadWear account, view orders, wishlist, and account settings."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="pt-28 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                {/* User Info */}
                <div className="text-center mb-8">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={userData.avatar}
                      alt={`${userData.firstName} ${userData.lastName}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-gray-600">
                    Member since {userData.memberSince}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {userData.totalOrders}
                    </div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userData.loyaltyPoints}
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
                        onClick={() => setActiveTab(item.id)}
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
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                    <FiLogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Account Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                      Account Overview
                    </h1>

                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-6">
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {userData.firstName}!
                      </h2>
                      <p className="opacity-90">
                        You've spent ${userData.totalSpent.toFixed(2)} and
                        earned {userData.loyaltyPoints} loyalty points
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
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiPackage className="w-6 h-6 text-blue-600" />
                        <span className="font-medium">Track Orders</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("wishlist")}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiHeart className="w-6 h-6 text-red-600" />
                        <span className="font-medium">View Wishlist</span>
                      </button>
                    </div>

                    {/* Recent Orders */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Recent Orders
                        </h3>
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {ordersData.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative w-12 h-12">
                                <Image
                                  src={order.image}
                                  alt="Order item"
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {order.id}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {order.date}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ${order.total}
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Order History
                    </h1>
                    <div className="flex space-x-2">
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>All Orders</option>
                        <option>Last 30 days</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ordersData.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16">
                              <Image
                                src={order.image}
                                alt="Order item"
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-lg text-gray-900">
                                {order.id}
                              </div>
                              <div className="text-gray-600">
                                Placed on {order.date}
                              </div>
                              <div className="text-gray-600">
                                {order.items} item{order.items > 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <div className="text-right">
                              <div className="font-semibold text-lg text-gray-900">
                                ${order.total}
                              </div>
                              <div
                                className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiEye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiTruck className="w-4 h-4" />
                            <span>Track Package</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiDownload className="w-4 h-4" />
                            <span>Download Invoice</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {activeTab === "wishlist" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      My Wishlist
                    </h1>
                    <div className="text-gray-600">
                      {wishlistData.length} items
                    </div>
                  </div>

                  {wishlistData.length === 0 ? (
                    <div className="text-center py-16">
                      <FiHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Save items you love to your wishlist
                      </p>
                      <Link
                        href="/products"
                        className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistData.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                              <FiTrash2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-xl font-bold text-gray-900">
                                ${item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                                  item.inStock
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!item.inStock}
                              >
                                {item.inStock ? "Add to Cart" : "Out of Stock"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Shipping Addresses
                    </h1>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addressesData.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-lg p-6 ${
                          address.isDefault
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {address.type}
                              </h3>
                              {address.isDefault && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600 space-y-1">
                              <div>{address.name}</div>
                              <div>{address.street}</div>
                              <div>
                                {address.city}, {address.state} {address.zip}
                              </div>
                              <div>{address.country}</div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {activeTab === "payment" && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Payment Methods
                    </h1>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Add New Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-purple-600 bg-purple-50 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              •••• •••• •••• 4567
                            </div>
                            <div className="text-gray-600">Expires 12/26</div>
                            <div className="text-purple-600 text-sm font-medium">
                              Default Payment Method
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              •••• •••• •••• 8901
                            </div>
                            <div className="text-gray-600">Expires 08/27</div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>{editingProfile ? "Cancel" : "Edit"}</span>
                      </button>
                    </div>

                    {editingProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  lastName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={handleProfileSave}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingProfile(false)}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <FiUser className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {profileData.firstName} {profileData.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiMail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {profileData.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiPhone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">
                            {profileData.phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FiBell className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Order Updates
                            </div>
                            <div className="text-sm text-gray-600">
                              Get notified about your order status
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FiMail className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Promotional Emails
                            </div>
                            <div className="text-sm text-gray-600">
                              Receive updates about sales and new products
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FiShield className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Security Alerts
                            </div>
                            <div className="text-sm text-gray-600">
                              Get notified about account security events
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Security & Privacy
                    </h2>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FiShield className="w-5 h-5 text-gray-400" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Change Password
                            </div>
                            <div className="text-sm text-gray-600">
                              Update your account password
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </button>

                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FiShield className="w-5 h-5 text-gray-400" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Two-Factor Authentication
                            </div>
                            <div className="text-sm text-gray-600">
                              Add an extra layer of security
                            </div>
                          </div>
                        </div>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FiDownload className="w-5 h-5 text-gray-400" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Download Account Data
                            </div>
                            <div className="text-sm text-gray-600">
                              Get a copy of your account information
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </button>

                      <button className="w-full flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FiTrash2 className="w-5 h-5 text-red-500" />
                          <div className="text-left">
                            <div className="font-medium text-red-900">
                              Delete Account
                            </div>
                            <div className="text-sm text-red-600">
                              Permanently delete your account and data
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-red-400"
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
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
