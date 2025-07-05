"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () => [
      { name: "Shop", href: "/shop" },
      { name: "About Us", href: "/about-us" },
      { name: "Track", href: "/track" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "FAQ", href: "/faq" },
    ],
    []
  );

  // Check if current page is homepage
  const isHomepage = pathname === "/";

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header style based on page and scroll state
  const headerStyle = useMemo(() => {
    if (isHomepage) {
      return isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg"
        : "bg-transparent";
    }
    return "bg-white/95 backdrop-blur-md shadow-lg";
  }, [isHomepage, isScrolled]);

  const textColor = useMemo(() => {
    if (isHomepage) {
      return isScrolled ? "text-gray-900" : "text-white";
    }
    return "text-gray-900";
  }, [isHomepage, isScrolled]);

  const hoverBg = useMemo(
    () =>
      isHomepage && !isScrolled ? "hover:bg-gray-100/20" : "hover:bg-gray-100",
    [isHomepage, isScrolled]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyle}`}
      role="banner"
    >
      {/* Top Banner with structured data for SEO */}
      <div
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 text-sm"
        itemScope
        itemType="https://schema.org/Offer"
      >
        <p itemProp="description">
          Free shipping on orders over $50 | 30-day returns |{" "}
          <Link href="/sale" className="underline font-semibold" itemProp="url">
            Shop Sale →
          </Link>
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-21">
          {/* Logo with SEO optimizations */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Home"
          >
            <div className="relative w-23 h-23">
              <Image
                src="/logo/cherryconcept1_.png"
                alt="Company Logo"
                width={92}
                height={92}
                priority
                className="object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`font-medium transition-colors duration-300 hover:text-purple-600 ${textColor} ${
                    pathname === item.href
                      ? "text-purple-600 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 after:rounded-full"
                      : ""
                  }`}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <FiChevronDown className="inline ml-1 w-4 h-4" />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <FiSearch className="w-6 h-6" />
            </button>

            {/* User Account */}
            <Link
              href="/account"
              className={`p-2 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              aria-label="Account"
            >
              <FiUser className="w-6 h-6" />
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className={`relative p-2 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  aria-live="polite"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200/20">
            <div className="relative max-w-md">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
                aria-label="Search products"
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="Submit search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          role="navigation"
          aria-label="Mobile menu"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block py-2 font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-900 hover:text-purple-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
