import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/lib/api";
import ProductList from "@/components/shop-component/ShopComponent";

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
      },
    ],
    queryFn: () => fetchProducts(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductList />
    </HydrationBoundary>
  );
}
