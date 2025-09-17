"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchHomepageCollections } from "@/lib/api";
import { ArrowRight } from "lucide-react";

// Skeleton Loader for a single collection card
const CollectionSkeleton = () => (
  <div className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse"></div>
);

export default function FeaturedCollections() {
  const {
    data: collectionsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepageCollections"], // 👈 Updated query key for the new data
    queryFn: fetchHomepageCollections,
  });

  // This logic is now much simpler. It maps the direct API response to the UI.
  const collections = useMemo(() => {
    if (!collectionsData?.data) return [];

    // Map the API response to the structure needed by the JSX
    return collectionsData.data.map((collection) => {
      let url = "/shop";
      if (collection.collection_type === "new") {
        url = "/shop?is_new=true";
      } else if (collection.collection_type === "best_seller") {
        url = "/shop?is_best_seller=true";
      } else if (collection.collection_type === "popular") {
        url = "/shop?is_popular=true";
      }

      return {
        id: collection.collection_type,
        title: collection.name,
        description: collection.description,
        image: collection.image_url || "/placeholder-image.jpg",
        itemCount: collection.item_count,
        url: url,
      };
    });
  }, [collectionsData]);

  if (isError) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Could not load featured collections.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {collections.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Collections
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Curated collections for every style and occasion, ready to be
                explored.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CollectionSkeleton />
                <CollectionSkeleton />
                <CollectionSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {collections.map((collection) => (
                  <Link
                    href={collection.url}
                    key={collection.id}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className="aspect-[4/5] relative">
                        <Image
                          src={collection.image}
                          alt={collection.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-1 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                          {collection.title}
                        </h3>
                        <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {collection.itemCount} items
                          </span>
                          <div className="flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                            Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
