import FAQComponent from "@/components/faq-component/FaqComponent";

export const metadata = {
  title: "FAQ | Cherryl Concept",
  description:
    "Checkout our Most Frequently Asked Questions about Cherryl Concept.",

  openGraph: {
    title: "FAQ Cherryl Concept",
    description:
      "Discover our mission, values, and the story behind our brand.",
    url: "https://cherrylconcept.com/faq",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept FAQ Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function FaqPage() {
  return <FAQComponent />;
}
