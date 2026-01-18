/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "server-psi-lake-59.vercel.app",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend route
        destination: "https://server-psi-lake-59.vercel.app/:path*", // deployed backend
      },
    ];
  },
};

export default nextConfig;
