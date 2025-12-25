/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  // No longer need @repo/core here if it's strictly local files mapped via tsconfig paths,
  // but keeping it doesn't hurt.

  // Disable production browser source maps to reduce 404 errors
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Optimize fonts
  optimizeFonts: true,

  // Disable caching in development to prevent stale assets
  async headers() {
    // Only apply no-cache headers in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
          ],
        },
        {
          // Fonts should still be cached but with shorter TTL in dev
          source: '/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=3600, must-revalidate',
            },
          ],
        },
      ];
    }
    return [];
  },

  // Suppress webpack warnings
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce webpack logging noise
      config.infrastructureLogging = {
        level: 'error',
      };

      // Suppress cache strategy warnings
      config.ignoreWarnings = [
        { module: /node_modules/ },
        { message: /PackFileCacheStrategy/ },
      ];
    }

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    return config;
  },
};

export default nextConfig;
