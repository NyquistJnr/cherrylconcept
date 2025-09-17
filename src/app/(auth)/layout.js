import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cherryl Concept",
  description:
    "Explore the full collection of premium hats, stylish caps, human hair wigs, and accessories at Cherryl Concept. Find your perfect style. Free shipping available!",
};

export default function RootLayout({ children }) {
  return <div className={inter.className}>{children}</div>;
}
