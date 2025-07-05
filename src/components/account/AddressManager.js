"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import LoadingSpinner from "../generic/LoadingSpinner";

export default function AddressManager() {
  const { authenticatedFetch } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    label: "Home",
    first_name: "",
    last_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/`
      );

      if (response.ok) {
        const result = await response.json();
        setAddresses(result.data || []);
      } else {
        throw new Error("Failed to load addresses");
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      setError("Failed to load addresses. Please try again.");
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      label: "Home",
      first_name: "",
      last_name: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "USA",
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const validateForm = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "address_line1",
      "city",
      "state",
      "postal_code",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }

    return true;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) return;

    try {
      setFormLoading(true);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/`,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Address added successfully!");
        await loadAddresses(); // Reload to get updated data
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAddress = async (address) => {
    try {
      setLoading(true);

      // Fetch the full address details
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/${address.id}/`
      );

      if (response.ok) {
        const result = await response.json();
        const addressData = result.data;

        setFormData({
          label: addressData.label || "Home",
          first_name: addressData.first_name || "",
          last_name: addressData.last_name || "",
          phone_number: addressData.phone_number || "",
          address_line1: addressData.address_line1 || "",
          address_line2: addressData.address_line2 || "",
          city: addressData.city || "",
          state: addressData.state || "",
          postal_code: addressData.postal_code || "",
          country: addressData.country || "USA",
        });

        setEditingAddress(address.id);
        setShowAddForm(true);
      } else {
        toast.error("Failed to load address details");
      }
    } catch (error) {
      console.error("Error loading address:", error);
      toast.error("Failed to load address details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!validateForm()) return;

    try {
      setFormLoading(true);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/${editingAddress}/`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Address updated successfully!");
        await loadAddresses();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      setFormLoading(true);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/${addressId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Address deleted successfully!");
        await loadAddresses();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setFormLoading(true);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/shipping-addresses/${addressId}/set-default/`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Default address updated successfully!");
        await loadAddresses();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && addresses.length === 0) {
    return <LoadingSpinner message="Loading your addresses..." />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Shipping Addresses
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your delivery addresses ({addresses.length} saved)
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={loadAddresses}
            disabled={loading}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh addresses"
          >
            <FiRefreshCw
              className={`w-5 h-5 text-gray-600 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label *
              </label>
              <select
                value={formData.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={formLoading}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+1234567890"
                disabled={formLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John"
                disabled={formLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Doe"
                disabled={formLoading}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.address_line1}
                onChange={(e) =>
                  handleInputChange("address_line1", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="123 Main Street"
                disabled={formLoading}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address_line2}
                onChange={(e) =>
                  handleInputChange("address_line2", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Apt 4B, Unit 5, etc."
                disabled={formLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="New York"
                disabled={formLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="NY"
                disabled={formLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) =>
                  handleInputChange("postal_code", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="10001"
                disabled={formLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={formLoading}
              >
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              disabled={formLoading}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {formLoading && <LoadingSpinner size="small" />}
              <span>
                {formLoading
                  ? "Saving..."
                  : editingAddress
                  ? "Update Address"
                  : "Add Address"}
              </span>
            </button>
            <button
              onClick={resetForm}
              disabled={formLoading}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <FiMapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first shipping address to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border-2 rounded-lg p-6 ${
                address.is_default
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMapPin className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">
                      {address.label}
                    </h3>
                    {address.is_default && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <FiCheck className="w-3 h-3" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div className="font-medium">{address.full_name}</div>
                    {address.phone_number && (
                      <div className="text-sm">{address.phone_number}</div>
                    )}
                    <div className="text-sm">{address.formatted_address}</div>
                    <div className="text-xs text-gray-500">
                      Added {formatDate(address.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    disabled={formLoading}
                    className="text-gray-400 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.is_default || formLoading}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      address.is_default
                        ? "Cannot delete default address"
                        : "Delete address"
                    }
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  disabled={formLoading}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={formLoading}
                    className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
