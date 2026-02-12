const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!configuredBasePath) return normalizedPath;
  if (normalizedPath === configuredBasePath || normalizedPath.startsWith(`${configuredBasePath}/`)) {
    return normalizedPath;
  }
  return `${configuredBasePath}${normalizedPath}`;
}
