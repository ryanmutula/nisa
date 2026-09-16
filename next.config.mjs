/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // The packshots are pre-cut .webp files served straight from /public;
    // they are already the right size, so no resizing pipeline is needed.
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  }
};

export default nextConfig;
