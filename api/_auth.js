import crypto from "node:crypto";

const SESSION_COOKIE = "aayush_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const getEnv = (name) => process.env[name] || "";

const base64url = (value) => Buffer.from(value).toString("base64url");

const sign = (value, secret) =>
  crypto.createHmac("sha256", secret).update(value).digest("base64url");

const cookieHeader = (value, maxAgeSeconds, secure) =>
  [
    `${SESSION_COOKIE}=${value}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");

const getCookies = (req) => {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) {
      return acc;
    }

    acc[rawKey] = decodeURIComponent(rawValue.join("=") || "");
    return acc;
  }, {});
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const createSessionToken = (email, secret) => {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const encodedPayload = base64url(payload);
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
};

const verifySessionToken = (token, secret, expectedEmail) => {
  if (!token || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    return (
      typeof payload.exp === "number" &&
      payload.exp > Date.now() &&
      typeof payload.email === "string" &&
      payload.email === expectedEmail
    );
  } catch {
    return false;
  }
};

const authConfig = () => {
  const email = getEnv("vipul.m3011@gamil.com");
  const password = getEnv("abc@123");
  const secret = getEnv("ADMIN_SESSION_SECRET");

  if (!email || !password || !secret) {
    throw new Error("Missing ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_SESSION_SECRET");
  }

  return { email, password, secret };
};

const isSecureRequest = (req) => req.headers["x-forwarded-proto"] === "https";

export {
  SESSION_COOKIE,
  authConfig,
  cookieHeader,
  createSessionToken,
  getCookies,
  isSecureRequest,
  verifySessionToken,
};
