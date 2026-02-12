import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoNameFromEnv = process.env.GITHUB_REPOSITORY?.split("/")[1];
const configuredBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (isProd && repoNameFromEnv ? `/${repoNameFromEnv}` : "");
const basePath = configuredBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
