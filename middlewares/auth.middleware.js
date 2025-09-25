import User from "../models/UserSchema.js";

import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from "../utils/jwt.js";
import { cookieBase } from "../utils/auth.cookies.js";

export async function requireAuth(req, res, next) {  //isAuthenticated
  try {
    const token = req.signedCookies?.access_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) return res.status(401).json({ error: "Session invalid" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid of expired token" });
  }
}

export async function refreshIfNeeded(req, res, next) {
  const access = req.signedCookies?.access_token;
  const refresh = req.signedCookies?.refresh_token;
  if (!refresh) return next();

  try {
    verifyAccessToken(access);
    return next();
  } catch {
    try {
      const payload = verifyRefreshToken(refresh);
      const newAccess = signAccessToken({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        username: payload.username,
      });
      res.cookie("access_token", newAccess, cookieBase);
    } catch {}
    return next();
  }
}