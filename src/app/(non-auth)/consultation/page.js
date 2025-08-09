"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

// --- SVG Icon Components for a better UI ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    />
  </svg>
);

// --- Reusable UI Components ---

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- Beautiful Feedback Modal ---
const FeedbackModal = ({ type, title, message, onClose }) => {
  if (!type) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-95 hover:scale-100 transition-transform duration-300">
        <div
          className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mt-6">{title}</h3>
        <p className="text-gray-600 mt-2 text-base">{message}</p>
        <button
          onClick={onClose}
          className={`w-full mt-8 py-3 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105 ${
            isSuccess
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Done" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function ConsultationPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // State to manage the modal
  const [modalState, setModalState] = useState({
    type: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setModalState({ type: null, title: "", message: "" }); // Reset modal on new submission

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const headers = { "Content-Type": "application/json" };
    if (isAuthenticated && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const body = { consultation_time: consultationTime, message: message };
    if (!isAuthenticated) {
      body.full_name = fullName;
      body.email = email;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/consultations/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.message || "An unexpected error occurred.";
        if (data.detail) errorMessage = data.detail;
        if (data.consultation_time)
          errorMessage = `Consultation Time: ${data.consultation_time.join(
            " "
          )}`;
        throw new Error(errorMessage);
      }

      // Show success modal
      setModalState({
        type: "success",
        title: "All Set!",
        message:
          "Your consultation is booked. We'll be in touch soon, so stay close to your email.",
      });

      // Reset form
      setFullName("");
      setEmail("");
      setConsultationTime("");
      setMessage("");
    } catch (err) {
      // Show error modal
      setModalState({
        type: "error",
        title: "Oops! Something went wrong.",
        message:
          err.message ||
          "We couldn’t book your consultation. Please check your details and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalState({ type: null, title: "", message: "" });
  };

  // Function to get the minimum datetime for the input (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <Head>
        <title>Schedule a Consultation | Let's Talk</title>
        <meta
          name="description"
          content="Book a time that works for you. Let's discuss how we can help you achieve your goals."
        />
      </Head>

      <FeedbackModal {...modalState} onClose={handleCloseModal} />

      <div className="bg-white font-sans">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-[160px] px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Book a Consultation
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {isAuthenticated
                  ? "Welcome back! Let's find a time to chat."
                  : "Ready to get started? Find a time that works for you."}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isAuthenticated && (
                  <>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <UserIcon />
                      </div>
                      <input
                        id="full-name"
                        name="full-name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <EmailIcon />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <label
                    htmlFor="consultation-time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preferred Date & Time
                  </label>
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center top-7">
                    <CalendarIcon />
                  </div>
                  <input
                    id="consultation-time"
                    name="consultation-time"
                    type="datetime-local"
                    min={getMinDateTime()}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={consultationTime}
                    onChange={(e) => setConsultationTime(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Message{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center top-7">
                    <MessageIcon />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tell us a bit about what you need help with..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner /> : "Confirm & Book Session"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
