// components/skeletons/ShopSkeleton.js

// This component represents a single product card in its loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
  </div>
);

// This is the main skeleton component that mimics your entire shop page layout
export default function ShopSkeleton() {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 animate-pulse">
      {/* Skeleton for the page header */}
      <div className="bg-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <div className="h-12 bg-gray-400 rounded w-1/2"></div>
            <div className="h-6 bg-gray-400 rounded w-full"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Skeleton for the Filter Sidebar */}
          <aside className="lg:w-80 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-8">
              {/* Filter Block 1 */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
              {/* Filter Block 2 */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </aside>

          {/* Skeleton for the Main Content & Product Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/5"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
