/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'images.unsplash.com', 'ui-avatars.com'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' http://localhost:3000 http://localhost:8000; img-src 'self' data: blob: http://localhost:3000 http://localhost:8000 https://localhost:8000 https://images.unsplash.com https://ui-avatars.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; connect-src 'self' http://localhost:3000 http://localhost:8000; frame-src 'self'; object-src 'none'"
          }
        ],
      },
    ];
  },
}

export default nextConfig
