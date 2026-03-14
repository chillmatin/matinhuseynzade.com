import { defineMiddleware } from "astro:middleware";
import { THESIS_AUTH_COOKIE, isValidSessionValue } from "./lib/thesisAuth";

const applySecurityHeaders = (response: Response) => {

  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith("/thesis")) {
    const response = await next();
    return applySecurityHeaders(response);
  }

  if (pathname === "/thesis/login" || pathname === "/api/thesis-login") {
    const response = await next();
    return applySecurityHeaders(response);
  }

  const sessionSecret = import.meta.env.THESIS_SESSION_SECRET;
  if (!sessionSecret) {
    const response = await context.rewrite("/500");
    return applySecurityHeaders(response);
  }

  const sessionCookie = context.cookies.get(THESIS_AUTH_COOKIE)?.value;
  const isValid = isValidSessionValue(sessionCookie, sessionSecret);

  if (isValid) {
    const response = await next();
    return applySecurityHeaders(response);
  }

  const loginUrl = new URL("/thesis/login", context.url);
  const nextPath = pathname === "/thesis" ? "/thesis/" : pathname;
  loginUrl.searchParams.set("next", nextPath);
  const response = context.redirect(loginUrl.toString(), 302);
  return applySecurityHeaders(response);
});
