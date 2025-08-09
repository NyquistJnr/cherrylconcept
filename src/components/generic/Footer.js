import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const currentYear = new Date().getFullYear();

// Added `isUpcoming` property to flag new features
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
      isUpcoming: true,
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
  /*   {
    name: "TikTok",
    href: "https://tiktok.com/@yourbrand",
    Icon: FaTiktok,
    ariaLabel: "Follow us on TikTok",
  }, */
];

// Reusable component for link lists to keep code DRY
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

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10 pb-10 border-b border-gray-200">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">Join Our Style List</h2>
            <p className="text-gray-600">
              Get exclusive access to new arrivals, special offers, and styling
              tips.
            </p>
          </div>
          <form className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-r-md hover:bg-purple-700 transition-colors"
            >
              Subscribe
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
              Wearable art from Cherry Concept. Discover handcrafted headwear
              for the discerning woman worldwide
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
  );
}
