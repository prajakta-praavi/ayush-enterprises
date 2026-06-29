import { authConfig, getCookies, verifySessionToken } from "./_auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const config = authConfig();
    const cookies = getCookies(req);
    const authenticated = verifySessionToken(cookies.aayush_admin_session, config.secret, config.email);

    res.status(200).json({ authenticated });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
}
