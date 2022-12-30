/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "tile-b.openstreetmap.fr"],
  },
};

module.exports = nextConfig;
