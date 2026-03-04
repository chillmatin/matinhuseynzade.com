import type { APIRoute } from "astro";
import thesisHtml from "../../private/thesis.html?raw";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  // Fix base href for internal navigation to work correctly at /thesis
  const fixedHtml = thesisHtml
    .replace(/<base href="\.\.">/, '<base href="/thesis/">')
    .replace(/<base href="\.\."\/?>/, '<base href="/thesis/">');

  return new Response(fixedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
    },
  });
};
