"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export default function ProductDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetchProduct(id);
          const productData = response.data;

          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || "");
          setSelectedSize(productData.sizes?.[0] || "");

          // You can add related products API call here
          // const relatedResponse = await fetchRelatedProducts(productData.category);
          // setRelatedProducts(relatedResponse.data);
        } catch (error) {
          console.error("Error loading product:", error);
          // Handle error - maybe redirect to 404 page
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const StarRating = ({ rating, reviews, showCount = true }) => (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-600">
          {rating} ({reviews} reviews)
        </span>
      )}
    </div>
  );

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Adding to cart:", {
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });

    // Show success message (you can implement a toast notification)
    alert("Added to cart successfully!");
  };

  const ColorOption = ({ color, isSelected, onClick }) => {
    const getColorStyle = (color) => {
      const colorMap = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#10b981",
        yellow: "#f59e0b",
        purple: "#8b5cf6",
        pink: "#ec4899",
        orange: "#f97316",
        black: "#000000",
        white: "#ffffff",
        gray: "#6b7280",
        brown: "#92400e",
        navy: "#1e3a8a",
        beige: "#f5f5dc",
      };
      return colorMap[color.toLowerCase()] || "#6b7280";
    };

    return (
      <button
        onClick={onClick}
        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
          isSelected
            ? "border-purple-600 ring-2 ring-purple-200"
            : "border-gray-300 hover:border-gray-400"
        }`}
        style={{ backgroundColor: getColorStyle(color) }}
        title={color.charAt(0).toUpperCase() + color.slice(1)}
      />
    );
  };

  const VideoModal = ({ isOpen, onClose, videoUrl }) => {
    const videoId = getYouTubeVideoId(videoUrl);

    if (!isOpen || !videoId) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold">Product Video</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <main className="pt-[120px] min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-purple-600">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/shop"
                className="text-gray-500 hover:text-purple-600"
              >
                Products
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-gray-500 hover:text-purple-600"
              >
                {product.category_name}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={
                    product.all_image_urls[selectedImage] || product.main_image
                  }
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                {product.is_new && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Arrival
                  </span>
                )}
                {product.original_price && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    -{Math.round(product.discount_percentage)}% OFF
                  </span>
                )}
              </div>

              {/* Video Button */}
              {product.video_url && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg flex items-center justify-center space-x-3"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Watch Product Video</span>
                </button>
              )}

              {/* Thumbnail Images */}
              {product.all_image_urls && product.all_image_urls.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto">
                  {product.all_image_urls.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-purple-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-purple-600 font-medium uppercase tracking-wide">
                    {product.category_name}
                  </span>
                  {product.is_popular && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 text-xs font-semibold rounded-full">
                      Popular Choice
                    </span>
                  )}
                  {product.is_trending && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold rounded-full">
                      Trending
                    </span>
                  )}
                  {product.is_best_seller && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-semibold rounded-full">
                      Best Seller
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <StarRating
                  rating={parseFloat(product.rating)}
                  reviews={product.reviews_count}
                />
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 text-sm font-semibold rounded-full">
                      Save {formatPrice(product.original_price - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Color:{" "}
                    <span className="font-normal capitalize">
                      {selectedColor}
                    </span>
                  </h3>
                  <div className="flex space-x-3">
                    {product.colors.map((color) => (
                      <ColorOption
                        key={color}
                        color={color}
                        isSelected={selectedColor === color}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Size: <span className="font-normal">{selectedSize}</span>
                  </h3>
                  <div className="flex space-x-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-green-600 font-medium">
                    {product.is_active ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_active}
                  className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add to Cart - {formatPrice(product.price * quantity)}
                </button>
                <div className="flex space-x-4">
                  <button className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors duration-300">
                    Buy via WhatsApp
                  </button>
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
                    Share
                  </button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <h4 className="font-semibold mb-4">Shipping Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Standard Shipping:</span>
                    <span>5-7 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Shipping:</span>
                    <span>2-3 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overnight Shipping:</span>
                    <span>Next business day</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Free standard shipping on orders over ₦50,000
                </p>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: "description", name: "Description" },
                  { id: "features", name: "Features" },
                  { id: "specifications", name: "Specifications" },
                  { id: "reviews", name: `Reviews (${product.reviews_count})` },
                  { id: "shipping", name: "Shipping & Returns" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-purple-600 text-purple-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    This premium {product.category_name.toLowerCase()} is
                    designed with both style and functionality in mind. Whether
                    you're looking for everyday wear or something special for an
                    occasion, this piece delivers exceptional quality and
                    comfort that you'll love.
                  </p>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <span className="font-medium text-gray-700">
                            {key}:
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors">
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-purple-600">
                                {review.user.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {review.user}
                                </span>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <StarRating
                                rating={review.rating}
                                reviews={0}
                                showCount={false}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600 mb-3">{review.comment}</p>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Shipping & Returns
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Shipping Options</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Standard Shipping (Free over ₦50,000):</span>
                          <span>5-7 business days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Shipping (₦9,999):</span>
                          <span>2-3 business days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overnight Shipping (₦19,999):</span>
                          <span>Next business day</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Return Policy</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• 30-day return policy</li>
                        <li>• Free returns on all orders</li>
                        <li>
                          • Items must be unworn and in original packaging
                        </li>
                        <li>• Easy online return process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section - You can populate this with API data */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={relatedProduct.main_image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <StarRating
                        rating={parseFloat(relatedProduct.rating)}
                        reviews={relatedProduct.reviews_count}
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {relatedProduct.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(relatedProduct.original_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Modal */}
        <VideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoUrl={product.video_url}
        />
      </main>
    </>
  );
}

// For SSR, you can add this function to fetch product data on the server
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const response = await fetchProduct(id);

    return {
      props: {
        initialProduct: response.data,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      notFound: true,
    };
  }
}
