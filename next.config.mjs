/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.scdn.co",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
