/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/persimmon-pomodoro' : '',
  assetPrefix: isGithubPages ? '/persimmon-pomodoro/' : '',
};

export default nextConfig;
