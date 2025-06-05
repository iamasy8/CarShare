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
    domains: ['localhost', 'images.unsplash.com', 'ui-avatars.com', 'randomuser.me'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' http://localhost:3000 http://localhost:8000; img-src 'self' data: blob: http://localhost:3000 http://localhost:8000 https://localhost:8000 https://images.unsplash.com https://ui-avatars.com https://randomuser.me; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; connect-src 'self' http://localhost:3000 http://localhost:8000 https://*.pusher.com wss://*.pusher.com ws://*.pusher.com https://sockjs-*.pusher.com; frame-src 'self'; object-src 'none'"
          }
        ],
      },
    ];
  },
}

export default nextConfig
