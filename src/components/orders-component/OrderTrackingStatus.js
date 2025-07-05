"use client";

import {
  FiPackage,
  FiCheck,
  FiTruck,
  FiHome,
  FiClock,
  FiShoppingCart,
} from "react-icons/fi";

export default function OrderTrackingStatus({ order }) {
  const getTrackingSteps = () => {
    const steps = [
      {
        id: "placed",
        title: "Order Placed",
        description: "Your order has been placed successfully",
        icon: FiShoppingCart,
        date: order.created_at,
        completed: true,
      },
      {
        id: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed and is being prepared",
        icon: FiCheck,
        date: order.confirmed_at,
        completed:
          !!order.confirmed_at ||
          ["confirmed", "shipped", "delivered"].includes(order.status),
      },
      {
        id: "shipped",
        title: "Shipped",
        description: "Your order is on its way",
        icon: FiTruck,
        date: order.shipped_at,
        completed:
          !!order.shipped_at || ["shipped", "delivered"].includes(order.status),
      },
      {
        id: "delivered",
        title: "Delivered",
        description: "Your order has been delivered",
        icon: FiHome,
        date: order.delivered_at,
        completed: !!order.delivered_at || order.status === "delivered",
      },
    ];

    return steps;
  };

  const getCurrentStep = () => {
    switch (order.status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-primary-600";
      case "confirmed":
        return "text-purple-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadgeColor = () => {
    switch (order.status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = getTrackingSteps();
  const currentStep = getCurrentStep();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
          <p className="text-gray-600 mt-1">Track your order progress</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor()}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          {order.tracking_number && (
            <p className="text-sm text-gray-600 mt-1">
              Tracking: {order.tracking_number}
            </p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gray-200"></div>
        <div
          className="absolute left-8 top-12 w-0.5 bg-purple-600 transition-all duration-500"
          style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.completed;
            const isCurrent = index === currentStep && !isCompleted;

            return (
              <div key={step.id} className="relative flex items-start">
                {/* Step Icon */}
                <div
                  className={`
                  flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-purple-600 border-purple-600 text-white"
                      : isCurrent
                      ? "bg-white border-purple-600 text-purple-600"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                `}
                >
                  {isCompleted ? (
                    <FiCheck className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-6 flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          isCompleted || isCurrent
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isCompleted || isCurrent
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="flex items-center text-purple-600">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Info */}
      {order.notes && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Tracking Notes</h4>
          <p className="text-blue-800 text-sm whitespace-pre-line">
            {order.notes}
          </p>
        </div>
      )}

      {/* Shipping Address */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
        <div className="text-sm text-gray-600">
          <p className="font-medium">{order.customer_full_name}</p>
          <p>{order.shipping_address}</p>
          {order.customer_phone && <p>Phone: {order.customer_phone}</p>}
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.status === "shipped" && !order.delivered_at && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FiTruck className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-semibold text-green-900">
                Your order is on the way!
              </p>
              <p className="text-sm text-green-700">
                Estimated delivery: 2-5 business days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
