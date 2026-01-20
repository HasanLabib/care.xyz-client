/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "server-psi-lake-59.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
