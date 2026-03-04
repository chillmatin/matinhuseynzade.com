import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";

export const prerender = false;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

export const GET: APIRoute = async ({ params }) => {
  // Handle /thesis/ or no path as index.html
  let path = params.path || "";
  if (path === "" || path.endsWith("/")) {
    path = path + "index.html";
  }

  const thesisRoot = resolve(process.cwd(), "src/private/thesis");
  const requestedPath = resolve(thesisRoot, path);
  if (requestedPath !== thesisRoot && !requestedPath.startsWith(`${thesisRoot}${sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = join(thesisRoot, path);

  try {
    const fileContent = await readFile(filePath);
    const ext = path.substring(path.lastIndexOf("."));
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
};

export function getStaticPaths() {
  return [];
}
