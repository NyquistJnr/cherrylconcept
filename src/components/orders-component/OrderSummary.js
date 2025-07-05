"use client";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiGift,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";

export default function OrderSummary({ order, formatCurrency, formatDate }) {
  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Order Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold">#{order.order_number}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Date</span>
            <span className="font-medium">{formatDate(order.created_at)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Items</span>
            <span className="font-medium">{getTotalItems()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Status</span>
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium capitalize
              ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "confirmed"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            `}
            >
              {order.status}
            </span>
          </div>

          {order.tracking_number && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tracking Number</span>
              <span className="font-medium text-blue-600">
                {order.tracking_number}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Customer Information
        </h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FiUser className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">{order.customer_full_name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FiMail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">{order.customer_email}</p>
            </div>
          </div>

          {order.customer_phone && (
            <div className="flex items-center space-x-3">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">{order.customer_phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Shipping Address
        </h3>

        <div className="flex items-start space-x-3">
          <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-900">
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

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {formatCurrency(order.shipping_fee)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">
              {formatCurrency(order.tax_amount)}
            </span>
          </div>

          {order.loyalty_points_used > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Points Used</span>
              <span>-{order.loyalty_points_used.toLocaleString()} pts</span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Points */}
      {order.loyalty_points_earned > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FiGift className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-purple-900">
              Loyalty Points
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-700">Points Earned</span>
              <span className="font-bold text-purple-900">
                +{order.loyalty_points_earned.toLocaleString()}
              </span>
            </div>

            {order.loyalty_points_used > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-700">Points Used</span>
                <span className="font-medium text-purple-800">
                  -{order.loyalty_points_used.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Important Dates */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Important Dates
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Order Placed</span>
            </div>
            <span className="text-sm font-medium">
              {formatDate(order.created_at)}
            </span>
          </div>

          {order.confirmed_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiPackage className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Order Confirmed</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(order.confirmed_at)}
              </span>
            </div>
          )}

          {order.shipped_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiPackage className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Shipped</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(order.shipped_at)}
              </span>
            </div>
          )}

          {order.delivered_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiPackage className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Delivered</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(order.delivered_at)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
