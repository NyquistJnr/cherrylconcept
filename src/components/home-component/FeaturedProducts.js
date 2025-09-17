"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeFeaturedProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";

// Skeleton Loader for a single product card
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-12 bg-gray-200 rounded-full w-full"></div>
  </div>
);

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  const {
    data: featuredData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homeFeaturedProducts"],
    queryFn: fetchHomeFeaturedProducts,
  });

  const featuredProducts = useMemo(() => {
    if (!featuredData?.data) return [];

    // The API now returns a simple array directly, so we just map it.
    return featuredData.data.map((product) => {
      let badge = null;
      if (product.is_best_seller) badge = "Best Seller";
      else if (product.is_new) badge = "New";
      else if (product.discount_percentage >= 40) badge = "Sale";

      return {
        ...product,
        image: product.main_image,
        originalPrice: product.original_price,
        badge,
      };
    });
  }, [featuredData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(
        product,
        product.colors?.[0] || "",
        product.sizes?.[0] || "",
        1
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Could not add to cart.");
      console.error(error);
    }
  };

  if (isError) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Could not load featured products.</p>
        </div>
      </section>
    );
  }

  // Hide the whole section if there are no products to show
  if (!isLoading && featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked favorites that our customers love.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                href={`/shop/${product.id}`}
                key={product.id}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden">
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 z-10 text-white px-3 py-1 text-xs font-semibold rounded-full ${
                          product.badge === "Sale" ? "bg-red-500" : "bg-black"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-base text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full mt-auto bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
