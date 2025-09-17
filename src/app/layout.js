import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/generic/ToastProvider";
import { CartProvider } from "@/contexts/CartContext";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cherryl Concept",
  description:
    "Explore the full collection of premium hats, stylish caps, human hair wigs, and accessories at Cherryl Concept. Find your perfect style. Free shipping available!",

  openGraph: {
    title: "Cherryl Concept",
    description:
      "Discover our mission, values, and the story behind our brand.",
    url: "https://cherrylconcept.com",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
