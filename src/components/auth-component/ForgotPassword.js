"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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

  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setCurrentStep("reset");
    }
  }, [searchParams]);

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
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Password reset email sent successfully! Check your inbox."
        );
        setCurrentStep("sent");
        setCountdown(60);
      } else {
        const errorMessage =
          data.errors?.email?.[0] ||
          data.errors?.non_field_errors?.[0] ||
          data.message ||
          "Failed to send reset email.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
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
    setResetData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      calculatePasswordStrength(value);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 lg:grid lg:grid-cols-2">
      {/* --- Left Panel: The Form Steps --- */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 group"
            >
              <FiArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* Step 1: Enter Email */}
              {currentStep === "email" && (
                <motion.div
                  key="email"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMail className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Forgot Password?
                    </h1>
                    <p className="text-gray-600">
                      Enter your email and we'll send you a reset link.
                    </p>
                  </div>
                  {errors.general && (
                    <p className="text-sm text-red-600 text-center mb-4">
                      {errors.general}
                    </p>
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
                        <FiMail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({});
                          }}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.email ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <FiLoader className="w-5 h-5 mr-2 animate-spin" />{" "}
                          Sending Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Email Sent */}
              {currentStep === "sent" && (
                <motion.div
                  key="sent"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Check Your Email
                    </h1>
                    <p className="text-gray-600 mb-4">
                      We've sent a password reset link to:
                    </p>
                    <p className="text-lg font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                      {email}
                    </p>
                    <div className="mt-6 space-y-4">
                      <button
                        onClick={handleResendEmail}
                        disabled={countdown > 0 || isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border rounded-lg font-medium bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                        ) : countdown > 0 ? (
                          <FiClock className="w-5 h-5 mr-2" />
                        ) : (
                          <FiRefreshCw className="w-5 h-5 mr-2" />
                        )}
                        {countdown > 0
                          ? `Resend in ${countdown}s`
                          : "Resend Email"}
                      </button>
                      <button
                        onClick={() => setCurrentStep("email")}
                        className="w-full text-purple-600 font-medium hover:underline"
                      >
                        Try a Different Email
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {currentStep === "reset" && (
                <motion.div
                  key="reset"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShield className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Set New Password
                    </h1>
                    <p className="text-gray-600">
                      Create a new, strong password for your account.
                    </p>
                  </div>
                  {errors.general && (
                    <p className="text-sm text-red-600 text-center mb-4">
                      {errors.general}
                    </p>
                  )}
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    {/* (New Password and Confirm Password fields with all logic) */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <FiLock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={resetData.password}
                          onChange={handleResetDataChange}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.password
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FiEyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FiEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {resetData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                                style={{
                                  width: `${(passwordStrength / 5) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                        </div>
                      )}
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <FiLock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={resetData.confirmPassword}
                          onChange={handleResetDataChange}
                          className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.confirmPassword
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FiEye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <FiLoader className="w-5 h-5 mr-2 animate-spin" />{" "}
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Right Panel: The Image --- */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <Image
          src="/images/hero/forgot.jpeg"
          alt="Account security"
          fill
          priority
          className="object-cover"
        />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Security is Our
            <br />
            Top Priority.
          </h2>
          <p className="text-lg text-gray-200">
            Follow the steps to securely regain access to your account. We're
            here to help.
          </p>
        </div>
      </div>
    </div>
  );
}
