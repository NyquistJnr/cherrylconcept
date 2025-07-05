"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiClock,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState("email"); // email, sent, reset
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Reset password form data
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check if we have a reset token in URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setCurrentStep("reset");
    }
  }, [searchParams]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Email sent successfully
        console.log("Password reset email sent:", data);

        // Show success toast
        toast.success(
          "Password reset email sent successfully! Check your inbox.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setCurrentStep("sent");
        setCountdown(60); // Start 60 second countdown
      } else {
        // Handle API errors
        if (data.errors) {
          if (data.errors.email) {
            const errorMessage = Array.isArray(data.errors.email)
              ? data.errors.email[0]
              : data.errors.email;
            setErrors({ email: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.errors.non_field_errors) {
            const errorMessage = data.errors.non_field_errors[0];
            setErrors({ general: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            const errorMessage =
              "Failed to send reset email. Please try again.";
            setErrors({ general: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } else if (data.message) {
          setErrors({ general: data.message });
          toast.error(data.message, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          const errorMessage = "Failed to send reset email. Please try again.";
          setErrors({ general: errorMessage });
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCountdown(60);
        toast.success("Reset email sent again! Check your inbox.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const errorMessage = "Failed to resend email. Please try again.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Resend email error:", error);
      const errorMessage = "Failed to resend email. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!resetData.password) {
      newErrors.password = "Password is required";
    } else if (resetData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (resetData.password !== resetData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            new_password: resetData.password,
            confirm_password: resetData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Password reset successful
        console.log("Password reset successful:", data);

        // Show success toast
        toast.success(
          "Password reset successfully! You can now sign in with your new password.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Redirect to login with success message
        router.push("/login?message=Password reset successfully");
      } else {
        // Handle API errors
        if (data.errors) {
          if (data.errors.token) {
            const errorMessage = Array.isArray(data.errors.token)
              ? data.errors.token[0]
              : data.errors.token;
            setErrors({ general: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.errors.non_field_errors) {
            const errorMessage = data.errors.non_field_errors[0];
            setErrors({ general: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.errors.new_password) {
            const errorMessage = Array.isArray(data.errors.new_password)
              ? data.errors.new_password[0]
              : data.errors.new_password;
            setErrors({ password: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.errors.confirm_password) {
            const errorMessage = Array.isArray(data.errors.confirm_password)
              ? data.errors.confirm_password[0]
              : data.errors.confirm_password;
            setErrors({ confirmPassword: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            const errorMessage = "Failed to reset password. Please try again.";
            setErrors({ general: errorMessage });
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } else if (data.message) {
          setErrors({ general: data.message });
          toast.error(data.message, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          const errorMessage = "Failed to reset password. Please try again.";
          setErrors({ general: errorMessage });
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDataChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <>
      <main className="pt-[30px] min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Back to Login */}
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            {/* Step 1: Enter Email */}
            {currentStep === "email" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMail className="w-8 h-8 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600">
                    No worries! Enter your email address and we'll send you a
                    link to reset your password.
                  </p>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">
                        {errors.general}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email)
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <FiAlertCircle className="w-4 h-4" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-purple-600 hover:text-purple-700"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Email Sent */}
            {currentStep === "sent" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Check Your Email
                  </h1>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-lg font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {email}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <FiClock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">What to do next:</p>
                      <ul className="space-y-1">
                        <li>• Check your email inbox for the reset link</li>
                        <li>• The link will expire in 1 hour for security</li>
                        <li>• Check your spam folder if you don't see it</li>
                        <li>• Click the link to set a new password</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                        Resending...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <FiClock className="w-4 h-4 mr-2" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className="w-4 h-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentStep("email")}
                    className="w-full flex justify-center items-center py-3 px-4 border border-purple-600 rounded-lg shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    Try Different Email
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Need help?{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-purple-600 hover:text-purple-700"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Reset Password */}
            {currentStep === "reset" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Set New Password
                  </h1>
                  <p className="text-gray-600">
                    Create a strong password for your HeadWear account
                  </p>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">
                        {errors.general}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="space-y-6">
                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={resetData.password}
                        onChange={handleResetDataChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                          errors.password
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {resetData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Use 8+ characters with letters, numbers, and symbols
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <FiAlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={resetData.confirmPassword}
                        onChange={handleResetDataChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                          errors.confirmPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {resetData.confirmPassword &&
                      resetData.password === resetData.confirmPassword && (
                        <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                          <FiCheck className="w-4 h-4" />
                          <span>Passwords match</span>
                        </p>
                      )}
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <FiAlertCircle className="w-4 h-4" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>

                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FiShield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium mb-1">Security Tips:</p>
                      <ul className="space-y-1">
                        <li>• Use a unique password you don't use elsewhere</li>
                        <li>• Consider using a password manager</li>
                        <li>
                          • Enable two-factor authentication for extra security
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
