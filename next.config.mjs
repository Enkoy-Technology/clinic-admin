/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  // No longer need @repo/core here if it's strictly local files mapped via tsconfig paths,
  // but keeping it doesn't hurt.

  // Disable production browser source maps to reduce 404 errors
  productionBrowserSourceMaps: false,

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
    return config;
  },
};

export default nextConfig;
