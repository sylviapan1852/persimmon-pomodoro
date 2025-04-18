/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/persimmon-pomodoro',
  assetPrefix: '/persimmon-pomodoro/',
  trailingSlash: true, // ensures paths end in / which helps with static hosting
  output: 'export',     // if you're using static export (for GitHub Pages)
  publicRuntimeConfig: {
    basePath: '/persimmon-pomodoro',
  },
};

export default nextConfig;
