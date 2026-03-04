export function getGeneratedOgImagePath(pathname: string): string {
  const pathWithLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalizedPath = pathWithLeadingSlash !== "/" ? pathWithLeadingSlash.replace(/\/+$/, "") : "/";

  if (normalizedPath === "/") {
    return "/opengraph-image.png";
  }

  return `${normalizedPath}/index.png`;
}