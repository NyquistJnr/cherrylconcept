import Header from "@/components/generic/Header";
import Link from "next/link";

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

// --- Main 404 Page Component ---
export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
        <div className="text-center max-w-lg w-full">
          {/* Main Error Graphic and Text */}
          <div className="relative">
            <h1 className="text-9xl font-extrabold text-purple-200 tracking-wider">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              <h2 className="text-4xl font-bold text-gray-800">
                Page Not Found
              </h2>
            </div>
          </div>

          {/* Informative Message */}
          <p className="text-lg text-gray-600 mt-6 mb-10">
            Oops! It seems the page you're looking for has taken a little
            detour. Don't worry, we can help you get back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" legacyBehavior>
              <button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105">
                <ArrowLeftIcon />
                Go Back Home
              </button>
            </Link>
            <Link href="/contact-us" legacyBehavior>
              <button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 transition-transform transform hover:scale-105">
                <HomeIcon />
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
