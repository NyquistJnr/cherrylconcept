"use client";

import { useState } from "react";
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";

// Mock addresses data - replace with API call
const mockAddressesData = [
  {
    id: 1,
    type: "Home",
    name: "John Doe",
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
    name: "John Doe",
    street: "456 Business Blvd",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "United States",
    isDefault: false,
  },
];

export default function AddressManager() {
  const [addresses, setAddresses] = useState(mockAddressesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      type: "Home",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);
      // Here you would make an API call to add address
      // await authenticatedFetch('/api/addresses', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });

      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      };

      setAddresses((prev) => [...prev, newAddress]);
      resetForm();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    setEditingAddress(address.id);
    setShowAddForm(true);
  };

  const handleUpdateAddress = async () => {
    try {
      setLoading(true);
      // Here you would make an API call to update address
      // await authenticatedFetch(`/api/addresses/${editingAddress}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(formData)
      // });

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress ? { ...addr, ...formData } : addr
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      setLoading(true);
      // Here you would make an API call to delete address
      // await authenticatedFetch(`/api/addresses/${addressId}`, {
      //   method: 'DELETE'
      // });

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoading(true);
      // Here you would make an API call to set default address
      // await authenticatedFetch(`/api/addresses/${addressId}/set-default`, {
      //   method: 'POST'
      // });

      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
    } catch (error) {
      console.error("Error setting default address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Shipping Addresses
          </h1>
          <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter full name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter state/province"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter ZIP/postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingAddress
                ? "Update Address"
                : "Add Address"}
            </button>
            <button
              onClick={resetForm}
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
                address.isDefault
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMapPin className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">
                      {address.type}
                    </h3>
                    {address.isDefault && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <FiCheck className="w-3 h-3" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <div className="font-medium">{address.name}</div>
                    <div>{address.street}</div>
                    <div>
                      {address.city}, {address.state} {address.zip}
                    </div>
                    <div>{address.country}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.isDefault}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={loading}
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
