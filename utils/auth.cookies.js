// utils/auth.cookies.js
const isProd = process.env.NODE_ENV === "production";

export const accessCookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: isProd,
  path: "/",                 // access for whole API
  maxAge: 10 * 60 * 1000,    // 10 minutes
};

export const refreshCookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: isProd,
  path: "/api/auth",         // IMPORTANT: must match your auth routes
  maxAge: 15 * 60 * 1000,    // 15 minutes
};

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, accessCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions);
}

// robust clearer: clear with the same options, and also try the other path just in case
export function clearAuthCookies(res) {
  // primary
  res.clearCookie("access_token",  { ...accessCookieOptions,  maxAge: 0 });
  res.clearCookie("refresh_token", { ...refreshCookieOptions, maxAge: 0 });

  // fallback clears in case cookie was set with a different path previously
  res.clearCookie("access_token",  { ...accessCookieOptions,  path: "/",        maxAge: 0 });
  res.clearCookie("refresh_token", { ...refreshCookieOptions, path: "/",        maxAge: 0});
  res.clearCookie("refresh_token", { ...refreshCookieOptions, path: "/api/auth",maxAge: 0 });
}
