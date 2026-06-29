import http from "node:http";
import {
  authConfig,
  cookieHeader,
  createSessionToken,
  getCookies,
  isSecureRequest,
  verifySessionToken,
} from "../api/_auth.js";

process.env.ADMIN_EMAIL ||= "admin@example.com";
process.env.ADMIN_PASSWORD ||= "admin1234";
process.env.ADMIN_SESSION_SECRET ||= "local-dev-secret";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);

const sendJson = (res, statusCode, payload, headers = {}) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...headers,
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);

  res.setHeader("Cache-Control", "no-store");

  try {
    if (url.pathname === "/api/admin-status") {
      if (req.method !== "GET") {
        sendJson(res, 405, { authenticated: false, error: "Method not allowed" });
        return;
      }

      const config = authConfig();
      const cookies = getCookies(req);
      const authenticated = verifySessionToken(cookies.aayush_admin_session, config.secret, config.email);

      sendJson(res, 200, { authenticated });
      return;
    }

    if (url.pathname === "/api/admin-login") {
      if (req.method !== "POST") {
        sendJson(res, 405, { authenticated: false, error: "Method not allowed" });
        return;
      }

      const rawBody = await readBody(req);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const { email, password } = body;
      const config = authConfig();

      if (email !== config.email || password !== config.password) {
        sendJson(res, 401, { authenticated: false });
        return;
      }

      const token = createSessionToken(email, config.secret);
      res.setHeader("Set-Cookie", cookieHeader(token, 8 * 60 * 60, isSecureRequest(req)));
      sendJson(res, 200, { authenticated: true });
      return;
    }

    if (url.pathname === "/api/admin-logout") {
      if (req.method !== "POST") {
        sendJson(res, 405, { authenticated: false, error: "Method not allowed" });
        return;
      }

      res.setHeader("Set-Cookie", cookieHeader("", 0, isSecureRequest(req)));
      sendJson(res, 200, { authenticated: false });
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, {
      authenticated: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
});

server.listen(port, host, () => {
  console.log(`API server listening on http://${host}:${port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
