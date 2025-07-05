"use client";

import { FiLoader } from "react-icons/fi";

export default function LoadingSpinner({
  size = "default",
  message = "Loading...",
  fullScreen = false,
  className = "",
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <FiLoader
          className={`${sizeClasses[size]} text-purple-600 animate-spin`}
        />
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

// Alternative minimal loader for inline use
export function InlineLoader({ className = "" }) {
  return (
    <FiLoader className={`w-4 h-4 text-purple-600 animate-spin ${className}`} />
  );
}
