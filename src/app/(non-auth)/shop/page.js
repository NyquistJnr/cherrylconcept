import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { fetchProducts, fetchCategories } from "@/lib/api";
import ShopPageClient from "@/components/shop-component/ShopPageClient";
import ShopSkeleton from "@/components/shop-component/ShopSkeleton";

export default async function ShopPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "products",
      {
        searchQuery: "",
        selectedCategory: "all",
        selectedPriceRange: "all",
        sortBy: "featured",
        page: 1,
      },
    ],
    queryFn: () => fetchProducts({ page: 1 }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopPageClient />
      </Suspense>
    </HydrationBoundary>
  );
}
