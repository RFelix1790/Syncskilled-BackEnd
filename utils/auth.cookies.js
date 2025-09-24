// utils/auth.cookies.js

const isProd = process.env.NODE_ENV === "production";

// Short-lived access cookie (e.g., 10 minutes)
export const accessCookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: isProd,
  path: "/",                // available to whole API
  maxAge: 10 * 60 * 1000,   // 10 minutes
};

// Refresh cookie (15 minutes of inactivity)
export const refreshCookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: isProd,
  path: "/api/auth",        // scope to auth routes (optional, but keep consistent)
  maxAge: 15 * 60 * 1000,   // 15 minutes
};

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, accessCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions);
}

export function clearAuthCookies(res) {
  res.clearCookie("access_token", { ...accessCookieOptions, maxAge: 0 });
  res.clearCookie("refresh_token", { ...refreshCookieOptions, maxAge: 0 });
}
