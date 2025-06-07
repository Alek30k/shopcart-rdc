/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // 👈 Usa Webpack en lugar de Turbopack
  },
};

module.exports = nextConfig;
