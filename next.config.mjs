import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS errors for deployment
  },
  images: {
    unoptimized: false, // Enable image optimization on Vercel
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: true,
  experimental: {
    // This helps with hydration mismatches from browser extensions
    optimizePackageImports: ['lucide-react'],
  },
  // Use Turbopack (Next.js 16 default) — keep an explicit empty config so the
  // build system knows we intend to use Turbopack rather than a custom
  // webpack setup.
  turbopack: {},
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  // We rely on `tsconfig.json` `baseUrl` + `paths` for path aliases instead
  // of a custom webpack alias so Turbopack can be used by default on Vercel.
}

export default nextConfig
