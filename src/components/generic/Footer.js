import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdAccessTime, MdLocationOn } from "react-icons/md";

const currentYear = new Date().getFullYear();

const footerLinks = {
  shop: [
    {
      name: "All Products",
      href: "/shop",
      ariaLabel: "Browse all products",
    },
    {
      name: "New Arrivals",
      href: "/collections/new-arrivals",
      ariaLabel: "View new arrivals",
    },
    {
      name: "Best Sellers",
      href: "/collections/best-sellers",
      ariaLabel: "See best sellers",
    },
    {
      name: "Sale Items",
      href: "/collections/sale",
      ariaLabel: "Shop sale items",
    },
    {
      name: "Gift Cards",
      href: "/gift-cards",
      ariaLabel: "Purchase gift cards",
    },
  ],
  support: [
    {
      name: "Contact Us",
      href: "/contact-us",
      ariaLabel: "Contact our support",
    },
    { name: "Size Guide", href: "/size-guide", ariaLabel: "View size guide" },
    {
      name: "Care Instructions",
      href: "/care-guide",
      ariaLabel: "Read care instructions",
    },
    {
      name: "Shipping Info",
      href: "/shipping",
      ariaLabel: "Check shipping information",
    },
    {
      name: "Returns & Exchanges",
      href: "/returns",
      ariaLabel: "Learn about returns",
    },
  ],
  company: [
    { name: "About Us", href: "/about", ariaLabel: "Learn about our company" },
    { name: "Our Story", href: "/story", ariaLabel: "Read our story" },
    { name: "Blog", href: "/blog", ariaLabel: "Visit our blog" },
    {
      name: "Careers",
      href: "/careers",
      ariaLabel: "View career opportunities",
    },
    { name: "Press", href: "/press", ariaLabel: "See press coverage" },
  ],
  legal: [
    {
      name: "Privacy Policy",
      href: "/privacy",
      ariaLabel: "Read privacy policy",
    },
    {
      name: "Terms of Service",
      href: "/terms",
      ariaLabel: "View terms of service",
    },
    {
      name: "Cookie Policy",
      href: "/cookies",
      ariaLabel: "Learn about cookies",
    },
    {
      name: "Accessibility",
      href: "/accessibility",
      ariaLabel: "Accessibility information",
    },
  ],
};

// Social media links with react-icons
const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/yourstore",
    Icon: FaInstagram,
    ariaLabel: "Follow us on Instagram",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/yourstore",
    Icon: FaFacebook,
    ariaLabel: "Like us on Facebook",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourstore",
    Icon: FaTwitter,
    ariaLabel: "Follow us on Twitter",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/yourstore",
    Icon: FaPinterest,
    ariaLabel: "Follow us on Pinterest",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@yourstore",
    Icon: FaTiktok,
    ariaLabel: "Follow us on TikTok",
  },
];

// Contact information sections with react-icons
const contactInfo = [
  {
    title: "Contact Us",
    content: (
      <>
        <span className="flex items-center gap-2">
          <MdEmail className="inline" /> hello@hairwear.com
        </span>
        <span className="flex items-center gap-2">
          <MdPhone className="inline" /> +1 (555) 123-4567
        </span>
      </>
    ),
    Icon: MdEmail,
    ariaLabel: "Contact information",
  },
  {
    title: "Store Hours",
    content: (
      <>
        <span>Mon - Fri: 9AM - 6PM</span>
        <span>Sat - Sun: 10AM - 4PM</span>
      </>
    ),
    Icon: MdAccessTime,
    ariaLabel: "Store opening hours",
  },
  {
    title: "Address",
    content: (
      <>
        <span className="flex items-center gap-2">
          <MdLocationOn className="inline" /> 123 Fashion Street
        </span>
        <span>New York, NY 10001</span>
      </>
    ),
    Icon: MdLocationOn,
    ariaLabel: "Store location address",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 py-16">
        {/* Main footer grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand/Logo section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 mb-6"
              aria-label="HairWear Homepage"
            >
              <div className="relative w-25 h-25">
                <Image
                  src="/logo/cherryconcept1_.png"
                  alt="HairWear Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                  priority
                />
              </div>
            </Link>

            <p className="text-black mb-6 max-w-md">
              Transforming hair care with premium accessories that combine
              style, comfort, and protection. Made with love for every hair type
              and texture.
            </p>

            {/* Social media links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ name, href, Icon, ariaLabel }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
                  aria-label={ariaLabel}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map(({ name, href, ariaLabel }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-black hover:text-purple-600 transition-colors duration-300"
                    aria-label={ariaLabel}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map(({ name, href, ariaLabel }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-black hover:text-purple-600 transition-colors duration-300"
                    aria-label={ariaLabel}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ name, href, ariaLabel }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-black hover:text-purple-600 transition-colors duration-300"
                    aria-label={ariaLabel}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact information section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {contactInfo.map(({ title, content, Icon, ariaLabel }) => (
              <div key={title} className="text-center md:text-left">
                <h4 className="font-semibold mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Icon className="w-5 h-5" />
                  {title}
                </h4>
                <div className="text-black space-y-1" aria-label={ariaLabel}>
                  {content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom footer with copyright and legal links */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-black text-sm">
              © {currentYear} Cherryl Concept. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
              {footerLinks.legal.map(({ name, href, ariaLabel }) => (
                <Link
                  key={name}
                  href={href}
                  className="text-black hover:text-purple-600 transition-colors duration-300"
                  aria-label={ariaLabel}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
