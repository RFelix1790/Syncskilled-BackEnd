// middlewares/auth.js
import User from "../models/UserSchema.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from "../utils/jwt.js";
import { accessCookieOptions } from "../utils/auth.cookies.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.signedCookies?.access_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) return res.status(401).json({ error: "Session invalid" });

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" }); // fixed text
  }
}

/**
 * Optional convenience: if access is expired but refresh exists & is valid,
 * mint a new access cookie transparently on normal requests.
 * NOTE: keep this lightweight; don't silently swallow refresh failures.
 */
export async function refreshIfNeeded(req, res, next) {
   if (req.path.startsWith("/api/auth")) return next(); // never refresh on auth routes
  const access = req.signedCookies?.access_token;
  const refresh = req.signedCookies?.refresh_token;
  if (!refresh) return next();

  try {
    // If access is valid, proceed
    verifyAccessToken(access);
    return next();
  } catch {
    // Access invalid → try refresh
    try {
      const payload = verifyRefreshToken(refresh);
      const newAccess = signAccessToken({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        username: payload.username,
      });
      // IMPORTANT: set with correct access options (has maxAge)
      res.cookie("access_token", newAccess, accessCookieOptions);
    } catch {
      // If refresh is invalid, do NOT pretend it's fine; let downstream see 401
      // Don't clear here—leave that to /auth/refresh or explicit logout
    }
    return next();
  }
}
