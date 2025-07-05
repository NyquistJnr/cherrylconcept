"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { withGuest } from "@/components/generic/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiCheck,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

function SignUpPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general errors when user makes changes
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show validation errors as toasts
      Object.entries(errors).forEach(([field, message]) => {
        if (field !== "general") {
          toast.error(message);
        }
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the signup function from AuthContext
      const result = await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      if (result.success) {
        // Success toast is handled in AuthContext
        // Redirect to intended page or account
        const destination =
          redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/account";
        router.push(destination);
      } else {
        // Handle errors from AuthContext
        setErrors(result.errors || {});

        // Show specific error toasts
        if (result.errors?.non_field_errors) {
          toast.error(result.errors.non_field_errors[0]);
        } else if (result.errors?.email) {
          const errorMessage = Array.isArray(result.errors.email)
            ? result.errors.email[0]
            : result.errors.email;
          toast.error(errorMessage);
        } else if (result.errors?.password) {
          const errorMessage = Array.isArray(result.errors.password)
            ? result.errors.password[0]
            : result.errors.password;
          toast.error(errorMessage);
        } else if (result.errors?.phone_number) {
          const errorMessage = Array.isArray(result.errors.phone_number)
            ? result.errors.phone_number[0]
            : result.errors.phone_number;
          toast.error(errorMessage);
        } else if (result.errors?.first_name) {
          const errorMessage = Array.isArray(result.errors.first_name)
            ? result.errors.first_name[0]
            : result.errors.first_name;
          toast.error(errorMessage);
        } else if (result.errors?.last_name) {
          const errorMessage = Array.isArray(result.errors.last_name)
            ? result.errors.last_name[0]
            : result.errors.last_name;
          toast.error(errorMessage);
        } else if (result.errors?.general) {
          toast.error(result.errors.general);
        }
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="pt-[30px] min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join Cherryl Concept and start your style journey
              </p>
              {redirectUrl && (
                <p className="text-sm text-purple-600 mt-2">
                  Create an account to continue to your destination
                </p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="John"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.firstName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.lastName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.lastName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="+234 xxx xxx xxxx"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Use 8+ characters with letters, numbers, and symbols for a
                      strong password
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                      <FiCheck className="w-3 h-3 flex-shrink-0" />
                      <span>Passwords match</span>
                    </p>
                  )}
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-purple-600 hover:text-purple-700 underline"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-600 hover:text-purple-700 underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.terms}</span>
                  </p>
                )}

                <div className="flex items-start">
                  <input
                    id="newsletter"
                    type="checkbox"
                    checked={wantsNewsletter}
                    onChange={(e) => setWantsNewsletter(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="newsletter"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Send me updates about new products and exclusive offers
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Development Helper */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 mb-2">
                  Development Mode - Quick Fill:
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        firstName: "John",
                        lastName: "Doe",
                        email: "john.doe@mailinator.com",
                        phone: "+234 812 345 6789",
                        password: "Secure@Pass123!",
                        confirmPassword: "Secure@Pass123!",
                      })
                    }
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    Fill Demo
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                      })
                    }
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Wrap with guest protection to redirect authenticated users
export default withGuest(SignUpPage);
