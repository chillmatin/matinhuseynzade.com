import type { APIRoute } from "astro";
import { THESIS_AUTH_COOKIE, THESIS_MAX_AGE_SECONDS, createSessionValue } from "../../lib/thesisAuth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = form.get("password")?.toString() ?? "";
  const rawNextPath = form.get("next")?.toString() || "/thesis/";
  const nextPath = rawNextPath === "/thesis" ? "/thesis/" : rawNextPath;

  const expectedPassword = import.meta.env.THESIS_PASSWORD;
  const sessionSecret = import.meta.env.THESIS_SESSION_SECRET;

  if (!expectedPassword || !sessionSecret) {
    return new Response("Server is missing THESIS_PASSWORD or THESIS_SESSION_SECRET", { status: 500 });
  }

  if (password !== expectedPassword) {
    const failureUrl = new URL("/thesis/login", request.url);
    failureUrl.searchParams.set("error", "1");
    failureUrl.searchParams.set("next", nextPath.startsWith("/thesis") ? nextPath : "/thesis/");
    return redirect(failureUrl.toString(), 302);
  }

  cookies.set(THESIS_AUTH_COOKIE, createSessionValue(sessionSecret), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: THESIS_MAX_AGE_SECONDS,
  });

  return redirect(nextPath.startsWith("/thesis") ? nextPath : "/thesis/", 302);
};

export const DELETE: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(THESIS_AUTH_COOKIE, { path: "/" });
  return redirect("/thesis/login", 302);
};
