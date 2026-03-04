import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const prerender = false;

export const GET: APIRoute = async () => {
  const filePath = join(process.cwd(), "src/private/thesis/index.html");

  try {
    const fileContent = await readFile(filePath);

    return new Response(fileContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
};
