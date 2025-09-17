import ContactUsComponent from "@/components/contact-us-component/ContactUsComponent";

export const metadata = {
  title: "Contact Us | Cherryl Concept",
  description: "Contact Us, and we will response in no time.",

  openGraph: {
    title: "Contact Us Cherryl Concept",
    description:
      "Discover our mission, values, and the story behind our brand.",
    url: "https://cherrylconcept.com/contact-us",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept Contact Us Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function ContactUsPage() {
  return <ContactUsComponent />;
}
