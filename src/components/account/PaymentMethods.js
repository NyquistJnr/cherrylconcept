"use client";

import { useState } from "react";
import {
  FiCreditCard,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiShield,
} from "react-icons/fi";

// Mock payment methods data - replace with API call
const mockPaymentMethods = [
  {
    id: 1,
    type: "credit",
    brand: "visa",
    lastFour: "4567",
    expiryMonth: "12",
    expiryYear: "26",
    isDefault: true,
    holderName: "John Doe",
  },
  {
    id: 2,
    type: "credit",
    brand: "mastercard",
    lastFour: "8901",
    expiryMonth: "08",
    expiryYear: "27",
    isDefault: false,
    holderName: "John Doe",
  },
];

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
    });
    setShowAddForm(false);
  };

  const getBrandIcon = (brand) => {
    switch (brand) {
      case "visa":
        return "💳"; // In a real app, use actual brand icons
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const getBrandColor = (brand) => {
    switch (brand) {
      case "visa":
        return "bg-blue-100 text-blue-800";
      case "mastercard":
        return "bg-red-100 text-red-800";
      case "amex":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    return cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      // Here you would make an API call to add payment method
      // This would typically involve a secure payment processor like Stripe

      const newPaymentMethod = {
        id: Date.now(),
        type: "credit",
        brand: "visa", // This would be detected from the card number
        lastFour: formData.cardNumber.slice(-4),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: paymentMethods.length === 0,
        holderName: formData.holderName,
      };

      setPaymentMethods((prev) => [...prev, newPaymentMethod]);
      resetForm();
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      setLoading(true);
      // Here you would make an API call to delete payment method

      setPaymentMethods((prev) =>
        prev.filter((method) => method.id !== methodId)
      );
    } catch (error) {
      console.error("Error deleting payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      setLoading(true);
      // Here you would make an API call to set default payment method

      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === methodId,
        }))
      );
    } catch (error) {
      console.error("Error setting default payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-1">
            Manage your saved payment methods
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <FiShield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">
              Your payment information is secure
            </p>
            <p>
              We use industry-standard encryption to protect your payment
              details. Your full card number is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Payment Method
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={formData.holderName}
                onChange={(e) =>
                  handleInputChange("holderName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter cardholder name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={formData.expiryMonth}
                  onChange={(e) =>
                    handleInputChange("expiryMonth", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={formData.expiryYear}
                  onChange={(e) =>
                    handleInputChange("expiryYear", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={String(year).slice(-2)}>
                        {String(year).slice(-2)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) =>
                    handleInputChange(
                      "cvv",
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleAddPaymentMethod}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Payment Method"}
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

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-16">
          <FiCreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No payment methods saved
          </h3>
          <p className="text-gray-600 mb-6">
            Add a payment method for faster checkout
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-6 ${
                method.isDefault
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    {getBrandIcon(method.brand)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        •••• •••• •••• {method.lastFour}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getBrandColor(
                          method.brand
                        )}`}
                      >
                        {method.brand.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {method.holderName}
                    </div>
                    {method.isDefault && (
                      <div className="text-purple-600 text-sm font-medium flex items-center space-x-1 mt-1">
                        <FiCheck className="w-3 h-3" />
                        <span>Default Payment Method</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPaymentMethod(method.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className={`ml-4 px-3 py-1 rounded-lg text-sm font-medium ${
                    method.isDefault
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {method.isDefault ? "Default" : "Set as Default"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
