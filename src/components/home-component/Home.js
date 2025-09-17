"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const featuredProducts = [
  {
    id: 1,
    name: "Luxury Silk Hair Wrap",
    price: 49.99,
    originalPrice: 69.99,
    image: "/images/hairs/7.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Velvet Hair Scrunchie Set",
    price: 24.99,
    image: "/images/hairs/14.jpg",
    badge: "New",
  },
  {
    id: 3,
    name: "Satin Hair Bonnet",
    price: 19.99,
    image: "/images/hairs/20.jpg",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Designer Hair Headband",
    price: 34.99,
    image: "/images/hairs/12.jpg",
    badge: "Trending",
  },
];

const collections = [
  {
    id: 1,
    title: "New Arrivals",
    description: "Discover our latest hair wear collection",
    image: "/images/hairs/5.jpg",
    itemCount: 24,
    url: "/shop?is_new=true",
  },
  {
    id: 2,
    title: "Best Sellers",
    description: "Customer favorites that never go out of style",
    image: "/images/hairs/7.jpg",
    itemCount: 18,
    url: "/shop?is_best_seller=true",
  },
  {
    id: 3,
    title: "Popular Collection",
    description: "Luxury hair accessories for special occasions",
    image: "/images/hairs/21.jpg",
    itemCount: 12,
    url: "/shop?is_popular=true",
  },
];

const heroSlides = [
  {
    id: 1,
    title: "Adorn Your Crown",
    subtitle:
      "Experience the fusion of African heritage and contemporary style. Exquisite headwear for the modern woman, worldwide.",
    image: "/images/hero/111.jpg",
    cta: "Shop The Launch Collection",
  },
  {
    id: 2,
    title: "Style Meets Protection",
    subtitle:
      "Beyond fashion. Our headwear is crafted with premium, breathable fabrics to protect your hair with grace and elegance.",
    image: "/images/hero/222.jpg",
    cta: "Discover Protective Styles",
  },
  {
    id: 3,
    title: "Wear Your Masterpiece",
    subtitle:
      "This is not just headwear. This is a story told in thread, color, and pattern. Your story.",
    image: "/images/hero/333.jpg",
    cta: "Discover the Gallery",
  },
];

export default function HomeComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => router.push("/shop")}
                      className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 animate-fade-in-up animation-delay-400"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Hero Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
              <div className="mb-2 md:mb-0">
                <span className="font-semibold">
                  🎉 November Black Market Sale - Up to 5% Off Selected Items!
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Free shipping on orders over ₦100,000
                </span>
                <Link
                  href="/shop"
                  className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  Shop Sale
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Collections
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Curated collections for every style and occasion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-gray-200 mb-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-80">
                        {collection.itemCount} items
                      </span>
                      <Link
                        href={collection.url}
                        className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full"
                      >
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked favorites that our customers love
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 bg-black text-white px-3 py-1 text-xs font-semibold rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Ready to Transform Your Style?
            </h2>
            <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
              Book a free consultation with our hair styling experts or explore
              our complete collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/consultation"
                className="bg-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-purple-700 transition-colors duration-300 min-w-[200px] shadow-md hover:shadow-lg"
              >
                Book Consultation
              </Link>
              <Link
                href="/shop"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 text-lg font-semibold rounded-full hover:bg-purple-50 transition-colors duration-300 min-w-[200px]"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
