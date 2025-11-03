/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    
    serverActions: { allowedOrigins: ['*'] }
  },
  typedRoutes: true,
};

export default nextConfig;
