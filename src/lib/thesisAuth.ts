import { createHmac, timingSafeEqual } from "node:crypto";

export const THESIS_AUTH_COOKIE = "thesis_auth";
export const THESIS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const sign = (value: string, secret: string) => createHmac("sha256", secret).update(value).digest("hex");

export const createSessionValue = (secret: string) => {
  const payload = "thesis-auth";
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
};

export const isValidSessionValue = (sessionValue: string | undefined, secret: string) => {
  if (!sessionValue) {
    return false;
  }

  const [payload, signature] = sessionValue.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload, secret);

  const receivedBuffer = new TextEncoder().encode(signature);
  const expectedBuffer = new TextEncoder().encode(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer) && payload === "thesis-auth";
};
