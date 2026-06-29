import path from "node:path";

const corsOrigin = process.env.CORS_ORIGIN || "*";

export const commonHeaders = {
  "Access-Control-Allow-Origin": corsOrigin,
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const sendJson = (res, statusCode, payload, headers = {}) => {
  res.writeHead(statusCode, {
    ...commonHeaders,
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });

  res.end(JSON.stringify(payload));
};

export const sendBuffer = (res, statusCode, buffer, headers = {}) => {
  res.writeHead(statusCode, {
    ...commonHeaders,
    ...headers,
  });

  res.end(buffer);
};

export const sendText = (res, statusCode, text, headers = {}) => {
  res.writeHead(statusCode, {
    ...commonHeaders,
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });

  res.end(text);
};

export const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });

export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toBoolean = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  value === "true" ||
  value === "yes" ||
  value === "on";

export const sqlNow = () => new Date().toISOString().slice(0, 19).replace("T", " ");

export const basenameFromPath = (value) => {
  if (!value) {
    return "";
  }

  const input = String(value);

  try {
    const parsed = new URL(input);
    const name = path.posix.basename(parsed.pathname);
    return name || input;
  } catch {
    return path.posix.basename(input);
  }
};

export const guessMimeType = (value) => {
  const ext = path.posix.extname(String(value || "")).toLowerCase();

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
};

export const sendError = (res, statusCode, message, extra = {}) =>
  sendJson(res, statusCode, {
    error: message,
    ...extra,
  });

export const handleOptions = (res) => {
  res.writeHead(204, commonHeaders);
  res.end();
};
