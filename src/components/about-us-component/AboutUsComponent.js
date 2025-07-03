import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Instagram,
  Twitter,
  Palette,
  Leaf,
  Gem,
  Handshake,
  Globe,
  Zap,
  RefreshCw,
  Sprout,
  CircleDollarSign,
} from "lucide-react";

const ceo = {
  id: 1,
  name: "Sarah Johnson",
  role: "Founder & CEO",
  image: "/images/hairs/12.jpg",
  bio: "With over 15 years in fashion design, Sarah founded HeadWear with a vision to create stylish, comfortable head accessories for everyone.",
  social: {
    linkedin: "https://linkedin.com/in/sarahjohnson",
    instagram: "https://instagram.com/sarah_headwear",
  },
};

const values = [
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Creative Excellence",
    description:
      "We believe in pushing the boundaries of design while maintaining timeless appeal.",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Sustainability",
    description:
      "Committed to eco-friendly practices and sustainable materials in all our products.",
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Premium Quality",
    description:
      "Every piece is crafted with attention to detail and the highest quality standards.",
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: "Customer First",
    description:
      "Our customers are at the heart of everything we do, from design to service.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Reach",
    description:
      "Bringing stylish head wear to customers around the world with local understanding.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Innovation",
    description:
      "Constantly evolving and embracing new technologies to improve our products.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "Founded HeadWear with a simple mission: create beautiful, comfortable head accessories for everyone.",
  },
  {
    year: "2019",
    title: "First Collection",
    description:
      "Launched our debut collection of premium caps and hats, receiving overwhelming positive response.",
  },
  {
    year: "2020",
    title: "Sustainable Initiative",
    description:
      "Introduced our eco-friendly line using recycled and sustainable materials.",
  },
  {
    year: "2021",
    title: "Global Expansion",
    description:
      "Expanded internationally, bringing HeadWear to customers in over 25 countries.",
  },
  {
    year: "2022",
    title: "Innovation Award",
    description:
      "Received the Fashion Innovation Award for our revolutionary comfort-fit technology.",
  },
  {
    year: "2023",
    title: "Community Impact",
    description:
      "Launched our giveback program, donating head wear to those in need worldwide.",
  },
  {
    year: "2024",
    title: "New Horizons",
    description:
      "Introduced our premium wig collection and expanded into luxury head accessories.",
  },
];

const stats = [
  { number: "100K+", label: "Happy Customers" },
  { number: "50+", label: "Countries Served" },
  { number: "500+", label: "Unique Designs" },
  { number: "6", label: "Years of Excellence" },
];

export default function AboutUsPage() {
  const SocialIcon = ({ platform, url }) => {
    const icons = {
      linkedin: <Linkedin className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
      twitter: <Twitter className="w-5 h-5" />,
    };

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
      >
        {icons[platform]}
      </a>
    );
  };

  return (
    <>
      <Head>
        <title>About Us | HeadWear - Premium Head Accessories</title>
        <meta
          name="description"
          content="Learn about HeadWear's story, mission, and the passionate team behind our premium head accessories. Discover our commitment to quality, sustainability, and style."
        />
        <meta
          name="keywords"
          content="about headwear, company story, team, mission, values, sustainability"
        />
        <meta
          property="og:title"
          content="About HeadWear - Premium Head Accessories"
        />
        <meta
          property="og:description"
          content="Discover our story, values, and commitment to quality headwear."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta
          property="og:image"
          content="https://yourdomain.com/images/about-og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HeadWear",
            url: "https://yourdomain.com",
            logo: "https://yourdomain.com/images/logo.png",
            description: "Premium head accessories combining style and comfort",
            founder: {
              "@type": "Person",
              name: "Sarah Johnson",
            },
            foundingDate: "2018",
            sameAs: [
              "https://linkedin.com/company/headwear",
              "https://instagram.com/headwear_official",
            ],
          })}
        </script>
      </Head>

      <main className="pt-28 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Our Story
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto opacity-90 leading-relaxed">
              Crafting premium head wear that combines timeless style with
              modern comfort since 2018
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full"></div>
        </section>

        {/* Mission Statement */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0">
                To create premium head wear that empowers individuals to express
                their unique style while ensuring comfort, quality, and
                sustainability in every piece we craft. We believe that the
                right accessory can transform not just your look, but your
                confidence.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Our Values
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                The principles that guide every decision we make and every
                product we create
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-purple-600 mb-3 sm:mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Timeline */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Our Journey
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                From a simple idea to a global brand - here's how we've grown
                together
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Mobile Timeline */}
              <div className="block md:hidden space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                    <div className="absolute left-2 top-4 w-0.5 h-full bg-purple-200"></div>
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Timeline */}
              <div className="hidden md:block relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-200"></div>

                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center mb-12 ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                    <div
                      className={`w-5/12 ${
                        index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                      }`}
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Meet Our Founder
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                The visionary behind HeadWear's success
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={ceo.image}
                    alt={ceo.name}
                    width={500}
                    height={500}
                    className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {ceo.name}
                  </h3>
                  <p className="text-sm sm:text-base text-purple-600 font-medium mb-3">
                    {ceo.role}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                    {ceo.bio}
                  </p>
                  <div className="flex space-x-3">
                    {Object.entries(ceo.social).map(([platform, url]) => (
                      <SocialIcon
                        key={platform}
                        platform={platform}
                        url={url}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Journey
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Be part of our story and discover head wear that's made with
              passion, designed for comfort, and created for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 min-w-[200px]"
              >
                Shop Collection
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-colors duration-300 min-w-[200px]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
