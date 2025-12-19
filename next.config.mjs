/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  // No longer need @repo/core here if it's strictly local files mapped via tsconfig paths,
  // but keeping it doesn't hurt.
};

export default nextConfig;
