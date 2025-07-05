// utils/auth.js - Utility functions for authentication

/**
 * Get user ID from various storage locations
 */
export const getUserId = () => {
  // Try sessionStorage first (most secure client-side option)
  if (typeof window !== "undefined") {
    const sessionUserId = sessionStorage.getItem("userId");
    if (sessionUserId) return sessionUserId;

    // Fallback to localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.id;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }

  return null;
};

/**
 * Get access token from cookies (server-side) or fallback to localStorage
 */
export const getAccessToken = (cookies = null) => {
  // Server-side: get from cookies
  if (cookies && cookies.accessToken) {
    return cookies.accessToken;
  }

  // Client-side fallback
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }

  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (cookies = null) => {
  const token = getAccessToken(cookies);
  const userId = getUserId();
  return !!(token && userId);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    // Clear client-side storage
    sessionStorage.removeItem("userId");
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Clear server-side cookies
  fetch("/api/auth/clear-tokens", {
    method: "POST",
    credentials: "include",
  }).catch((error) => {
    console.error("Error clearing server tokens:", error);
  });
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

/**
 * Make authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  // If token expired, try to refresh
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the request with new token
      response = await fetch(url, defaultOptions);
    }
  }

  return response;
};
