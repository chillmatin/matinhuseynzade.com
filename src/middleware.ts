import { defineMiddleware } from "astro:middleware";
import { THESIS_AUTH_COOKIE, isValidSessionValue } from "./lib/thesisAuth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith("/thesis")) {
    return next();
  }

  if (pathname === "/thesis/login" || pathname === "/api/thesis-login") {
    return next();
  }

  const sessionSecret = import.meta.env.THESIS_SESSION_SECRET;
  if (!sessionSecret) {
    return new Response("Server is missing THESIS_SESSION_SECRET", { status: 500 });
  }

  const sessionCookie = context.cookies.get(THESIS_AUTH_COOKIE)?.value;
  const isValid = isValidSessionValue(sessionCookie, sessionSecret);

  if (isValid) {
    return next();
  }

  const loginUrl = new URL("/thesis/login", context.url);
  loginUrl.searchParams.set("next", pathname);
  return context.redirect(loginUrl.toString(), 302);
});
