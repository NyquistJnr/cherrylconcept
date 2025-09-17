import "../globals.css";
import Header from "@/components/generic/Header";
import Footer from "@/components/generic/Footer";

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
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
