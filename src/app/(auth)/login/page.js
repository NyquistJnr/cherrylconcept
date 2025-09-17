import LoginComponent from "@/components/auth-component/LoginComponent";

export const metadata = {
  title: "Sign In | Cherryl Concept",
  description:
    "Securely sign in to your Cherryl Concept account to access your order history, track shipments, and enjoy a personalized shopping experience.",

  openGraph: {
    title: "Sign In to Cherryl Concept",
    description: "Access your account and continue your style journey.",
    url: "https://cherrylconcept.com/login",
    siteName: "Cherryl Concept",
    images: [
      {
        url: "https://res.cloudinary.com/djs4r0egg/image/upload/v1751710851/products/jodsegtmaymkkicbuwnw.png",
        width: 1200,
        height: 630,
        alt: "Cherryl Concept Login Page",
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

const LoginPage = () => {
  return <LoginComponent />;
};

export default LoginPage;
