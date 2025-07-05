"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiBell,
  FiShield,
  FiDownload,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import LoadingSpinner from "../generic/LoadingSpinner";

export default function AccountSettings() {
  const { user, authenticatedFetch, refreshUserProfile } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
  });
  const [notifications, setNotifications] = useState({
    order_updates: true,
    promotional_emails: false,
    security_alerts: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    try {
      setLoading(true);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`,
        {
          method: "PUT",
          body: JSON.stringify({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            phone_number: profileData.phone_number,
            username: profileData.username,
          }),
        }
      );

      if (response.ok) {
        await refreshUserProfile();
        setEditingProfile(false);
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // Here you would typically make an API call to save notification preferences
  };

  const handleCancelEdit = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        username: user.username || "",
      });
    }
    setEditingProfile(false);
  };

  const formatJoinDate = () => {
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Profile Information
          </h2>
          <button
            onClick={() =>
              editingProfile ? handleCancelEdit() : setEditingProfile(true)
            }
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
            disabled={loading}
          >
            {editingProfile ? (
              <FiX className="w-4 h-4" />
            ) : (
              <FiEdit2 className="w-4 h-4" />
            )}
            <span>{editingProfile ? "Cancel" : "Edit"}</span>
          </button>
        </div>

        {editingProfile ? (
          <div className="space-y-6">
            {/* Edit Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Display Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <FiUser className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium ml-2">
                    {user?.full_name ||
                      `${user?.first_name} ${user?.last_name}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiUser className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium ml-2">
                    {user?.username || "Not set"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium ml-2">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium ml-2">
                    {user?.phone_number || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium ml-2">{formatJoinDate()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Account status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      user?.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user?.is_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
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
                <div className="font-medium text-gray-900">Order Updates</div>
                <div className="text-sm text-gray-600">
                  Get notified about your order status
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.order_updates}
                onChange={() => handleNotificationChange("order_updates")}
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
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.promotional_emails}
                onChange={() => handleNotificationChange("promotional_emails")}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiShield className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">Security Alerts</div>
                <div className="text-sm text-gray-600">
                  Get notified about account security events
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.security_alerts}
                onChange={() => handleNotificationChange("security_alerts")}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Security & Privacy
        </h2>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FiShield className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Change Password</div>
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
                <div className="font-medium text-red-900">Delete Account</div>
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
  );
}
