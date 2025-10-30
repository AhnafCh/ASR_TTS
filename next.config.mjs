/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: true,
  experimental: {
    // This helps with hydration mismatches from browser extensions
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
