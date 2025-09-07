/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.datocms-assets.com'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
