"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import OrderTrackingStatus from "../orders-component/OrderTrackingStatus";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";
import Link from "next/link";

export default function OrderCallbackURL() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reference) {
      setError("No order reference found in URL.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/details/reference/${reference}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setOrder(result.data);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to retrieve order details"
          );
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "An unexpected error occurred");
        toast.error("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [reference]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Retrieving order details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Order
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/shop"
            className="block w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Here are your order details.
            </p>
          </div>

          {/* Order Content */}
          <div className="space-y-6">
            {/* 1. Order Header Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Order #{order.order_number}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <FiClock className="mr-1" />{" "}
                      {formatDate(order.created_at)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      Payment:{" "}
                      <span className="uppercase font-medium text-green-600">
                        {order.payment_method} ({order.payment_status})
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Tracking Status Component (Reused from your Tracking Page) */}
            <OrderTrackingStatus order={order} />

            {/* 3. Shipping & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiCheckCircle className="mr-2 text-purple-600" /> Customer
                  Details
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Name</span>
                    <span className="font-medium text-gray-900">
                      {order.customer_full_name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Email</span>
                    <span className="font-medium text-gray-900">
                      {order.customer_email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span className="font-medium text-gray-900">
                      {order.customer_phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-purple-600" /> Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">
                    {order.customer_full_name}
                  </p>
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && (
                    <p>{order.shipping_address_line2}</p>
                  )}
                  <p>
                    {order.shipping_city}, {order.shipping_state}{" "}
                    {order.shipping_postal_code}
                  </p>
                  <p>{order.shipping_country}</p>
                </div>
              </div>
            </div>

            {/* 4. Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiPackage className="mr-2 text-purple-600" /> Order Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product_name}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-x-3">
                        <span>Qty: {item.quantity}</span>
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.line_total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.product_price)} ea
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-2 text-sm text-gray-600 max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>{formatCurrency(order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                    <span>Total Paid</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8 pb-8">
              <Link
                href="/shop"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm"
              >
                Continue Shopping
              </Link>
              <Link
                href="/track"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Track your another Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
