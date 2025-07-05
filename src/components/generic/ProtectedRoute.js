"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Higher-Order Component for protecting routes that require authentication
 */
export function withAuth(WrappedComponent, options = {}) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    const {
      redirectTo = "/login",
      loadingComponent: LoadingComponent = LoadingSpinner,
      requiredRole = null,
      onUnauthorized = null,
    } = options;

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        // Store the current URL for redirect after login
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(
          currentPath
        )}`;
        router.push(loginUrl);
      }
    }, [loading, isAuthenticated, router, redirectTo]);

    // Check role-based access if required
    useEffect(() => {
      if (
        !loading &&
        isAuthenticated &&
        requiredRole &&
        user?.role !== requiredRole
      ) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          router.push("/unauthorized");
        }
      }
    }, [loading, isAuthenticated, user, requiredRole, onUnauthorized, router]);

    // Show loading while checking authentication
    if (loading) {
      return <LoadingComponent />;
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return <LoadingComponent />;
    }

    // Don't render if role check fails
    if (requiredRole && user?.role !== requiredRole) {
      return <LoadingComponent />;
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  };
}

/**
 * Component version for protecting routes
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
  loadingComponent: LoadingComponent = LoadingSpinner,
  requiredRole = null,
  fallback = null,
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`;
      router.push(loginUrl);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      router.push("/unauthorized");
    }
  }, [loading, isAuthenticated, user, requiredRole, router]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    return fallback || <LoadingComponent />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return fallback || <LoadingComponent />;
  }

  return children;
}

/**
 * HOC for protecting auth routes (login, signup) from authenticated users
 */
export function withGuest(WrappedComponent, options = {}) {
  return function GuestRoute(props) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const {
      redirectTo = "/account",
      loadingComponent: LoadingComponent = LoadingSpinner,
    } = options;

    useEffect(() => {
      if (!loading && isAuthenticated) {
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect");

        if (redirectPath && redirectPath.startsWith("/")) {
          router.push(redirectPath);
        } else {
          router.push(redirectTo);
        }
      }
    }, [loading, isAuthenticated, router, redirectTo]);

    // Show loading while checking authentication
    if (loading) {
      return <LoadingComponent />;
    }

    // Don't render if authenticated
    if (isAuthenticated) {
      return <LoadingComponent />;
    }

    // Render the guest component
    return <WrappedComponent {...props} />;
  };
}

/**
 * Component version for guest routes
 */
export function GuestRoute({
  children,
  redirectTo = "/account",
  loadingComponent: LoadingComponent = LoadingSpinner,
  fallback = null,
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect");

      if (redirectPath && redirectPath.startsWith("/")) {
        router.push(redirectPath);
      } else {
        router.push(redirectTo);
      }
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (isAuthenticated) {
    return fallback || <LoadingComponent />;
  }

  return children;
}
