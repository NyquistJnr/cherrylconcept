"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false); // Track if auth check is complete
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const getStoredTokens = () => {
    if (typeof window === "undefined")
      return { accessToken: null, userId: null };

    // Try to get from localStorage first (fallback)
    const accessToken = localStorage.getItem("accessToken");
    const userId =
      sessionStorage.getItem("userId") ||
      (localStorage.getItem("userData") &&
        JSON.parse(localStorage.getItem("userData")).id);

    return { accessToken, userId };
  };

  const checkAuthStatus = async () => {
    try {
      const { accessToken, userId } = getStoredTokens();

      if (accessToken && userId) {
        // Verify token by calling profile endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // The API returns { user: {...} }
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear auth data
          await clearAuthData();
        }
      } else {
        // No tokens found
        await clearAuthData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await clearAuthData();
    } finally {
      setLoading(false);
      setInitialized(true); // Mark as initialized regardless of success/failure
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store tokens securely
        await storeTokensSecurely(data.tokens, data.user.id);

        // Update context state
        setUser(data.user);
        setIsAuthenticated(true);

        // Show success toast
        toast.success(`Welcome back, ${data.user.first_name}!`);

        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          errors: data.errors || { general: data.message },
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        errors: { general: "Network error. Please try again." },
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store tokens securely
        await storeTokensSecurely(data.tokens, data.user.id);

        // Update context state
        setUser(data.user);
        setIsAuthenticated(true);

        // Show success toast
        toast.success(`Welcome to HeadWear, ${data.user.first_name}!`);

        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          errors: data.errors || { general: data.message },
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        errors: { general: "Network error. Please try again." },
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if you have one
      const { accessToken } = getStoredTokens();
      if (accessToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear auth data regardless of API response
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);

      toast.success("You have been logged out successfully");
      router.push("/login");
    }
  };

  const storeTokensSecurely = async (tokens, userId) => {
    try {
      // Try to store in httpOnly cookies via API call
      await fetch("/api/auth/set-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          userId: userId,
        }),
      });

      // Store user ID in sessionStorage
      sessionStorage.setItem("userId", userId);

      // Store non-sensitive user data in localStorage
      const userData = { id: userId };
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing tokens in cookies:", error);
    }

    // Always store in localStorage as fallback
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("userId", userId);
  };

  const clearAuthData = async () => {
    // Clear client-side storage
    sessionStorage.removeItem("userId");
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");

    // Clear server-side cookies
    try {
      await fetch("/api/auth/clear-tokens", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error clearing server tokens:", error);
    }
  };

  // Function to get current access token
  const getAccessToken = () => {
    const { accessToken } = getStoredTokens();
    return accessToken;
  };

  // Function to make authenticated API requests
  const authenticatedFetch = async (url, options = {}) => {
    // Wait for auth to be initialized before making requests
    if (!initialized) {
      // Wait for initialization to complete
      return new Promise((resolve, reject) => {
        const checkInit = () => {
          if (initialized) {
            // Retry the request after initialization
            authenticatedFetch(url, options).then(resolve).catch(reject);
          } else {
            setTimeout(checkInit, 100);
          }
        };
        checkInit();
      });
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    // If token expired (401), logout user
    if (response.status === 401) {
      toast.error("Your session has expired. Please log in again.");
      await logout();
      throw new Error("Token expired");
    }

    return response;
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // The API returns { user: {...} }
        return data.user;
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    initialized, // Expose this so components know when auth is ready
    login,
    signup,
    logout,
    checkAuthStatus,
    getAccessToken,
    authenticatedFetch,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
