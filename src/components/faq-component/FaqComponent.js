// pages/faq.js - FAQ Page
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const faqCategories = [
  {
    id: "shipping",
    name: "Shipping & Delivery",
    icon: "🚚",
    questions: [
      {
        id: 1,
        question: "How long does shipping take?",
        answer:
          "We offer multiple shipping options: Standard shipping takes 5-7 business days and is free on orders over $50. Express shipping takes 2-3 business days for $9.99, and overnight shipping delivers the next business day for $19.99.",
      },
      {
        id: 2,
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on your location. Customs fees and duties may apply and are the responsibility of the customer.",
      },
      {
        id: 3,
        question: "Can I track my order?",
        answer:
          "Absolutely! Once your order ships, you'll receive a tracking number via email. You can track your package using this number on our website or the carrier's website. You can also view your order status in your account dashboard.",
      },
      {
        id: 4,
        question: "What if my package is lost or damaged?",
        answer:
          "If your package arrives damaged or goes missing, please contact us immediately. We work with our shipping partners to resolve these issues quickly and will either replace your items or provide a full refund.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Exchanges",
    icon: "↩️",
    questions: [
      {
        id: 5,
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy on all unworn items in their original packaging with tags attached. Returns are free and easy - just use our online return portal to print a prepaid shipping label.",
      },
      {
        id: 6,
        question: "How do I return an item?",
        answer:
          "To return an item, log into your account and select the order you'd like to return. Choose the items and reason for return, then print the prepaid shipping label. Package the items securely and drop them off at any authorized shipping location.",
      },
      {
        id: 7,
        question: "Can I exchange an item for a different size or color?",
        answer:
          "Yes! You can exchange items for a different size or color within 30 days. Simply process a return for the original item and place a new order for your preferred option. If there's a price difference, we'll refund or charge accordingly.",
      },
      {
        id: 8,
        question: "How long do refunds take?",
        answer:
          "Once we receive your returned item, we'll process your refund within 2-3 business days. The refund will be credited back to your original payment method, which may take an additional 3-5 business days to appear on your statement.",
      },
    ],
  },
  {
    id: "sizing",
    name: "Sizing & Fit",
    icon: "📏",
    questions: [
      {
        id: 9,
        question: "How do I know what size to order?",
        answer:
          "Each product page includes detailed size charts with measurements. For hats and caps, measure the circumference of your head about 1 inch above your eyebrows. If you're between sizes, we generally recommend sizing up for comfort.",
      },
      {
        id: 10,
        question: "Are your sizes consistent across all products?",
        answer:
          "While we strive for consistency, sizing can vary slightly between different styles and manufacturers. Always check the specific size chart for each product, as measurements may differ between caps, hats, and other head wear.",
      },
      {
        id: 11,
        question: "What if the item doesn't fit?",
        answer:
          "If an item doesn't fit properly, you can return or exchange it within 30 days. We want you to be completely satisfied with your purchase, so don't hesitate to reach out if you need help finding the right size.",
      },
      {
        id: 12,
        question: "Do you offer adjustable sizing?",
        answer:
          "Many of our caps and some hats feature adjustable sizing options like snapback closures, velcro straps, or elastic bands. Check the product description for specific adjustment details.",
      },
    ],
  },
  {
    id: "products",
    name: "Products & Materials",
    icon: "🧢",
    questions: [
      {
        id: 13,
        question: "What materials are your products made from?",
        answer:
          "We use a variety of high-quality materials including cotton, wool, silk, synthetic blends, and eco-friendly recycled materials. Each product page lists the specific materials and care instructions.",
      },
      {
        id: 14,
        question: "Are your products sustainable?",
        answer:
          "Sustainability is important to us! Over 70% of our products use recycled or organic materials. We also partner with fair-trade manufacturers and offset our shipping carbon emissions.",
      },
      {
        id: 15,
        question: "How do I care for my head wear?",
        answer:
          "Care instructions vary by material. Generally, we recommend hand washing in cold water and air drying. Avoid harsh detergents and never put structured hats in the washing machine. Check the care label on each item for specific instructions.",
      },
      {
        id: 16,
        question: "Do you offer custom or personalized products?",
        answer:
          "Currently, we don't offer custom embroidery or personalization services. However, we're always expanding our product line with new styles and colors. Sign up for our newsletter to be the first to know about new releases!",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Orders",
    icon: "👤",
    questions: [
      {
        id: 17,
        question: "Do I need an account to place an order?",
        answer:
          "You can check out as a guest, but creating an account allows you to track orders, save favorite items, manage returns, and access exclusive member benefits. It only takes a minute to sign up!",
      },
      {
        id: 18,
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email within 10 minutes, check your spam folder.",
      },
      {
        id: 19,
        question: "Can I modify or cancel my order?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it, as long as it hasn't shipped yet. Contact our customer service team immediately, and we'll do our best to accommodate your request.",
      },
      {
        id: 20,
        question: "How do I update my shipping address?",
        answer:
          "You can update your default shipping address in your account settings. For orders that haven't shipped yet, contact customer service immediately to change the shipping address.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Pricing",
    icon: "💳",
    questions: [
      {
        id: 21,
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely with SSL encryption.",
      },
      {
        id: 22,
        question: "Do you offer payment plans?",
        answer:
          "Yes! We partner with Klarna and Afterpay to offer buy-now-pay-later options. You can split your purchase into 4 interest-free payments. These options are available at checkout for eligible orders.",
      },
      {
        id: 23,
        question: "Why was my payment declined?",
        answer:
          "Payment declines can happen for various reasons including insufficient funds, expired cards, or security holds by your bank. Double-check your payment information and contact your bank if the issue persists.",
      },
      {
        id: 24,
        question: "Do you offer discounts for bulk orders?",
        answer:
          "Yes! We offer special pricing for bulk orders and wholesale customers. Please contact our business sales team at wholesale@headwear.com for more information about volume discounts.",
      },
    ],
  },
];

const allQuestions = faqCategories.flatMap((category) =>
  category.questions.map((q) => ({
    ...q,
    category: category.name,
    categoryId: category.id,
  }))
);

export default function FAQComponent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState(new Set());
  const [filteredQuestions, setFilteredQuestions] = useState(allQuestions);

  useEffect(() => {
    let filtered = allQuestions;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      );
    }

    setFilteredQuestions(filtered);
  }, [selectedCategory, searchQuery]);

  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | HeadWear Help Center</title>
        <meta
          name="description"
          content="Find answers to common questions about HeadWear products, shipping, returns, sizing, and more. Get quick help with your order or account."
        />
        <meta
          name="keywords"
          content="FAQ, help, support, shipping, returns, sizing, headwear questions, customer service"
        />
        <link rel="canonical" href="https://yourdomain.com/faq" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="pt-28 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Quick answers to help you shop with confidence
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search frequently asked questions..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                All Questions
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.93-6.072-2.44m0 0L5 13m.928-.69A7.962 7.962 0 014 12c0-1.21.25-2.36.7-3.4M5 13l-.928.69M19 13l-.928-.69M19 13l.928.69"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Show All Questions
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                          {question.question}
                        </h3>
                        {selectedCategory === "all" && (
                          <span className="text-sm text-purple-600 font-medium">
                            {question.category}
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-500 transform transition-transform flex-shrink-0 ${
                          openQuestions.has(question.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openQuestions.has(question.id) && (
                      <div className="px-6 sm:px-8 pb-6">
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-600 leading-relaxed">
                            {question.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Our friendly customer support team is here to help you with any
                questions not covered in our FAQ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors min-w-[200px] text-center"
                >
                  Contact Support
                </Link>
                <a
                  href="tel:+15551234567"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors min-w-[200px] text-center"
                >
                  Call: (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
              Popular Help Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/shipping"
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Shipping Info
                    </h3>
                    <p className="text-sm text-gray-600">
                      Delivery times & costs
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/returns"
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">↩️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Returns</h3>
                    <p className="text-sm text-gray-600">Easy 30-day returns</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/size-guide"
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">📏</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Size Guide</h3>
                    <p className="text-sm text-gray-600">
                      Find your perfect fit
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
