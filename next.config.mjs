/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
nextConfig.images = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      port: "",
      pathname: "/**",
    },
  ],
};
