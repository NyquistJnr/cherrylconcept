"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FiDownload,
  FiMail,
  FiPhone,
  FiHelpCircle,
  FiMoreHorizontal,
  FiPrinter,
} from "react-icons/fi";

export default function OrderActions({ order }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    toast.success("Invoice download started");
    console.log("Download invoice for order:", order.order_number);
  };

  const handlePrintInvoice = () => {
    // In a real app, this would open a print dialog with the invoice
    window.print();
  };

  const handleContactSupport = () => {
    // Navigate to support page or open support modal
    toast.info("Redirecting to customer support");
  };

  const handleReportIssue = () => {
    // Navigate to issue reporting page
    toast.info("Opening issue report form");
  };

  const handleEmailTrackingInfo = () => {
    // Send tracking info via email
    toast.success("Tracking information sent to your email");
  };

  const canCancelOrder = () => {
    return order.status === "pending" || order.status === "confirmed";
  };

  const canReturnOrder = () => {
    return order.status === "delivered";
  };

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      // Cancel order API call
      toast.success("Order cancellation request submitted");
    }
  };

  const handleReturnOrder = () => {
    // Navigate to return process
    toast.info("Redirecting to return process");
  };

  return (
    <div className="relative">
      {/* Primary Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownloadInvoice}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          <span>Download Invoice</span>
        </button>

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handlePrintInvoice();
                      setShowDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiPrinter className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>

                  {order.tracking_number && (
                    <button
                      onClick={() => {
                        handleEmailTrackingInfo();
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>Email Tracking Info</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      handleContactSupport();
                      setShowDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiPhone className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>

                  <button
                    onClick={() => {
                      handleReportIssue();
                      setShowDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiHelpCircle className="w-4 h-4" />
                    <span>Report an Issue</span>
                  </button>

                  {/* Conditional Actions */}
                  {canCancelOrder() && (
                    <>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={() => {
                          handleCancelOrder();
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span>Cancel Order</span>
                      </button>
                    </>
                  )}

                  {canReturnOrder() && (
                    <>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={() => {
                          handleReturnOrder();
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <span>Return Items</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Action Buttons for Mobile */}
      <div className="sm:hidden mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={handleContactSupport}
          className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiPhone className="w-4 h-4" />
          <span>Support</span>
        </button>

        {canCancelOrder() && (
          <button
            onClick={handleCancelOrder}
            className="flex items-center justify-center space-x-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span>Cancel</span>
          </button>
        )}

        {canReturnOrder() && (
          <button
            onClick={handleReturnOrder}
            className="flex items-center justify-center space-x-2 px-3 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <span>Return</span>
          </button>
        )}
      </div>
    </div>
  );
}
