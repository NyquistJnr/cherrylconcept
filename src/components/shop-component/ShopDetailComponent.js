"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const allProducts = [
  {
    id: 1,
    name: "Classic Baseball Cap",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/hairs/7.jpg",
    images: [
      "/images/hairs/7.jpg",
      "/images/hairs/7-alt1.jpg",
      "/images/hairs/7-alt2.jpg",
      "/images/hairs/7-alt3.jpg",
    ],
    category: "caps",
    colors: ["black", "navy", "white", "red"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 128,
    isNew: false,
    isPopular: true,
    dateAdded: "2024-01-15",
    description:
      "A timeless classic that never goes out of style. This premium baseball cap features a comfortable cotton blend fabric, adjustable strap, and structured crown for the perfect fit.",
    features: [
      "100% cotton blend fabric",
      "Adjustable snapback closure",
      "Pre-curved visor",
      "Structured 6-panel crown",
      "Breathable eyelets",
      "One size fits most",
    ],
    specifications: {
      Material: "Cotton Blend",
      "Care Instructions": "Hand wash cold, air dry",
      "Brim Length": "7cm",
      "Crown Height": "11cm",
      Weight: "85g",
    },
    shipping: {
      standard: "5-7 business days",
      express: "2-3 business days",
      overnight: "Next business day",
    },
  },
  {
    id: 2,
    name: "Luxury Fedora Hat",
    price: 89.99,
    image: "/images/hairs/8.jpg",
    images: [
      "/images/hairs/8.jpg",
      "/images/hairs/8-alt1.jpg",
      "/images/hairs/8-alt2.jpg",
    ],
    category: "hats",
    colors: ["black", "brown", "gray"],
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviews: 45,
    isNew: true,
    isPopular: false,
    dateAdded: "2024-06-01",
    description:
      "Elevate your style with this sophisticated fedora hat. Crafted from premium wool felt with a classic center crease and pinched crown design.",
    features: [
      "Premium wool felt construction",
      "Classic center crease crown",
      "Grosgrain ribbon hatband",
      "Unlined interior",
      "Water resistant finish",
      "Handcrafted details",
    ],
    specifications: {
      Material: "100% Wool Felt",
      "Care Instructions": "Spot clean only",
      "Brim Width": "6cm",
      "Crown Height": "12cm",
      Weight: "120g",
    },
    shipping: {
      standard: "5-7 business days",
      express: "2-3 business days",
      overnight: "Next business day",
    },
  },
  // Add more products as needed...
];

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    date: "2024-05-15",
    title: "Perfect fit and style!",
    comment:
      "Love this cap! The quality is excellent and it fits perfectly. The color is exactly as shown in the photos.",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    user: "Mike R.",
    rating: 4,
    date: "2024-05-10",
    title: "Great quality",
    comment:
      "Well-made cap with good attention to detail. Comfortable to wear all day.",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    user: "Jennifer L.",
    rating: 5,
    date: "2024-05-05",
    title: "Highly recommended",
    comment:
      "Bought this for my husband and he absolutely loves it. Fast shipping too!",
    verified: false,
    helpful: 6,
  },
];

export default function ProductDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState(mockReviews);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);

  // Load product data
  useEffect(() => {
    if (id) {
      const foundProduct = allProducts.find((p) => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
        setSelectedSize(foundProduct.sizes[0]);

        // Get related products (same category, different products)
        const related = allProducts
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
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
              star <= rating ? "text-yellow-400" : "text-gray-300"
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
    const colorMap = {
      black: "#000000",
      navy: "#1a237e",
      white: "#ffffff",
      red: "#d32f2f",
      brown: "#5d4037",
      gray: "#616161",
      multi: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
      pink: "#e91e63",
      blue: "#2196f3",
      gold: "#ffd700",
      beige: "#f5f5dc",
      blonde: "#faf0be",
    };

    return (
      <button
        onClick={onClick}
        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
          isSelected
            ? "border-purple-600 ring-2 ring-purple-200"
            : "border-gray-300 hover:border-gray-400"
        }`}
        style={{
          background:
            color === "multi" ? colorMap[color] : colorMap[color] || color,
        }}
        title={color}
      />
    );
  };

  return (
    <>
      <Head>
        <title>{product.name} | Premium Head Wear</title>
        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content={`${product.category}, ${product.name}, head wear, fashion`}
        />
        <link
          rel="canonical"
          href={`https://yourdomain.com/products/${product.id}`}
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
      </Head>

      <main className="pt-28 min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-purple-600">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/products"
                className="text-gray-500 hover:text-purple-600"
              >
                Products
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href={`/products?category=${product.category}`}
                className="text-gray-500 hover:text-purple-600 capitalize"
              >
                {product.category}
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
                    product.images
                      ? product.images[selectedImage]
                      : product.image
                  }
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Arrival
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    Sale
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto">
                  {product.images.map((img, index) => (
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
                    {product.category}
                  </span>
                  {product.isPopular && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 text-xs font-semibold rounded-full">
                      Popular Choice
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <StarRating rating={product.rating} reviews={product.reviews} />
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 text-sm font-semibold rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
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

              {/* Size Selection */}
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
                      {size}
                    </button>
                  ))}
                </div>
              </div>

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
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
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
                    <span>{product.shipping.standard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Shipping:</span>
                    <span>{product.shipping.express}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overnight Shipping:</span>
                    <span>{product.shipping.overnight}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Free standard shipping on orders over $50
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
                  { id: "reviews", name: `Reviews (${product.reviews})` },
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
                    This premium {product.category} is designed with both style
                    and functionality in mind. Whether you're looking for
                    everyday wear or something special for an occasion, this
                    piece delivers exceptional quality and comfort that you'll
                    love.
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
                          <span>Standard Shipping (Free over $50):</span>
                          <span>{product.shipping.standard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Shipping ($9.99):</span>
                          <span>{product.shipping.express}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overnight Shipping ($19.99):</span>
                          <span>{product.shipping.overnight}</span>
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

          {/* Related Products */}
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
                        src={relatedProduct.image}
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
                        rating={relatedProduct.rating}
                        reviews={relatedProduct.reviews}
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${relatedProduct.price}
                        </span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${relatedProduct.originalPrice}
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
      </main>
    </>
  );
}
