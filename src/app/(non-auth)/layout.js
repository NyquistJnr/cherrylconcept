import "../globals.css";
import Header from "@/components/generic/Header";
import Footer from "@/components/generic/Footer";

export const metadata = {
  title: "Cherryl Concept",
  description:
    "Explore the full collection of premium hats, stylish caps, human hair wigs, and accessories at Cherryl Concept. Find your perfect style. Free shipping available!",
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
