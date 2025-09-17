import AboutUsComponent from "@/components/about-us-component/AboutUsComponent";

export const metadata = {
  title: "About Us | Cherryl Concept",
  description:
    "Learn the story behind Cherryl Concept. Discover our passion for quality, style, and our commitment to providing the best hats, wigs, and accessories in Lagos, Nigeria.",

  openGraph: {
    title: "About Cherryl Concept",
    description:
      "Discover our mission, values, and the story behind our brand.",
    url: "https://cherrylconcept.com/about-us",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept About Us Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutUsPage() {
  return <AboutUsComponent />;
}
