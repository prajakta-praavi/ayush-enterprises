import { authConfig, cookieHeader, createSessionToken, isSecureRequest } from "./_auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ authenticated: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { email, password } = body;
    const config = authConfig();

    if (email !== config.email || password !== config.password) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const token = createSessionToken(email, config.secret);
    res.setHeader("Set-Cookie", cookieHeader(token, 8 * 60 * 60, isSecureRequest(req)));
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
