/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/ourworld",
  assetPrefix: "/ourworld/",
  images: { unoptimized: true },
};

module.exports = nextConfig;