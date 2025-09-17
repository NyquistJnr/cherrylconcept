import SignUpComponent from "@/components/auth-component/SignUpComponent";

export const metadata = {
  title: "Register | Cherryl Concept",
  description:
    "Register to your Cherryl Concept account to access your order history, track shipments, and enjoy a personalized shopping experience.",

  openGraph: {
    title: "Sign In to Cherryl Concept",
    description: "Access your account and continue your style journey.",
    url: "https://cherrylconcept.com/signup",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept Sign Up Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: false,
    follow: true,
  },
};

const SignUpPage = () => {
  return <SignUpComponent />;
};

export default SignUpPage;
