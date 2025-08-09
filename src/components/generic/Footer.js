"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
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
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Awesome!" : "Got it"}
        </button>
      </div>
    </div>
  );
};

// --- Footer Data ---
const currentYear = new Date().getFullYear();
const footerLinks = {
  shop: [
    {
      name: "New Arrivals",
      href: "/shop/new-arrivals",
      ariaLabel: "View new arrivals",
      isUpcoming: true,
    },
    {
      name: "Best Sellers",
      href: "/shop/best-sellers",
      ariaLabel: "See our best selling headwear",
      isUpcoming: true,
    },
    {
      name: "Turbans",
      href: "/collections/turbans",
      ariaLabel: "Shop our Turban collection",
      isUpcoming: true,
    },
    {
      name: "Gele",
      href: "/collections/gele",
      ariaLabel: "Shop our Gele collection",
      isUpcoming: true,
    },
    {
      name: "Sale",
      href: "/shop/sale",
      ariaLabel: "Shop all sale items",
      isUpcoming: true,
    },
  ],
  help: [
    {
      name: "Contact Us",
      href: "/contact-us",
      ariaLabel: "Contact our support team",
    },
    {
      name: "Consultation",
      href: "/consultation",
      ariaLabel: "Book a styling consultation",
    },
    {
      name: "Track My Order",
      href: "/track",
      ariaLabel: "Track your shipment",
    },
    {
      name: "Shipping & Returns",
      href: "/shipping-returns",
      ariaLabel: "Learn about our shipping and return policies",
      isUpcoming: true,
    },
    { name: "FAQs", href: "/faq", ariaLabel: "Frequently Asked Questions" },
  ],
  about: [
    {
      name: "Our Story",
      href: "/about-us",
      ariaLabel: "Learn about our company and heritage",
    },
    {
      name: "Blog",
      href: "/blog",
      ariaLabel: "Read our articles on style and culture",
      isUpcoming: true,
    },
    {
      name: "Press",
      href: "/press",
      ariaLabel: "See press coverage about our brand",
      isUpcoming: true,
    },
  ],
};
const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/nwaukwachiedozie",
    Icon: FaInstagram,
    ariaLabel: "Follow us on Instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/Cherrylconcept",
    Icon: FaFacebook,
    ariaLabel: "Like us on Facebook",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2348033132903",
    Icon: FaWhatsapp,
    ariaLabel: "Chat with us on WhatsApp",
  },
];

// --- Reusable Link Column Component ---
function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-500 mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map(({ name, href, ariaLabel, isUpcoming }) => (
          <li key={name}>
            <Link
              href={href}
              className="text-gray-600 hover:text-purple-700 transition-colors inline-flex items-center"
              aria-label={ariaLabel}
            >
              {name}
              {isUpcoming && (
                <span className="ml-2 text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Main Footer Component ---
export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    title: "",
    message: "",
  });

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setModalState({ type: null, title: "", message: "" });

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Use the specific error message from the backend if available
        throw new Error(
          data.email?.[0] || "An unexpected error occurred. Please try again."
        );
      }

      setModalState({
        type: "success",
        title: "Welcome to the Club!",
        message:
          "You’re officially on the list. Get ready for exclusive access to new arrivals, special offers, and styling tips.",
      });
      setEmail(""); // Clear input on success
    } catch (err) {
      setModalState({
        type: "error",
        title: "Subscription Failed",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalState({ type: null, title: "", message: "" });
  };

  return (
    <>
      <FeedbackModal {...modalState} onClose={handleCloseModal} />
      <footer className="bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 pb-12 border-b border-gray-200">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                Join Our Style List
              </h2>
              <p className="text-gray-600 mt-2">
                Get exclusive access to new arrivals, special offers, and
                styling tips.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md shadow-sm rounded-lg"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                aria-label="Email address"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Subscribe"}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2 lg:col-span-1">
              <Link
                href="/"
                className="inline-block mb-4"
                aria-label="Cherryl Concept Homepage"
              >
                <Image
                  src="/logo/cherryconcept1_.png"
                  alt="Cherryl Concept Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>
              <p className="text-gray-600 mb-6 text-sm">
                Wearable art from Cherryl Concept. Discover handcrafted headwear
                for the discerning woman worldwide.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map(({ name, href, Icon, ariaLabel }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-purple-700 transition-colors"
                    aria-label={ariaLabel}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
            <FooterLinkColumn title="Shop" links={footerLinks.shop} />
            <FooterLinkColumn title="Help" links={footerLinks.help} />
            <FooterLinkColumn title="About Us" links={footerLinks.about} />
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-gray-500 mb-2 md:mb-0">
                © {currentYear} Cherryl Concept. All Rights Reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-purple-700"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-purple-700"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
