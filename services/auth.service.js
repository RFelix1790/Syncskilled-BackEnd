import User from "../models/UserSchema.js";
import { comparePassword, hashPassword } from "../utils/security.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { setAuthCookies, clearAuthCookies } from "../utils/auth.cookies.js";

export async function registerService(req, res) {
  try {
    const { name, email, username, password } = req.body || {};
    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ error: "name, email, username, password are required" });
    }

    const existing = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existing)
      return res.status(409).json({ error: "Email or username already taken" });

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      username: user.username,
    };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    setAuthCookies(res, access, refresh);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Failed to create a user", error);
    return res.status(500).json({ error: "Server error", error });
  }
}

export async function loginService(req, res) {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Email or username and password are required" });
    }

    const idn = String(identifier).toLowerCase();
    const user = await User.findOne({
      $or: [{ email: idn }, { username: idn }],
    }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const payload = {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
    };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    setAuthCookies(res, access, refresh);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login failed", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function logoutService(req, res) {
  try {
    clearAuthCookies(res);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Logout failed", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export function refreshService(req, res) {
  try {
    const refreshToken = req.signedCookies?.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });

    const user = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({
      sub: user.sub,
      email: user.email,
      name: user.name,
      username: user.username,
    });
    setAuthCookies(res, newAccessToken, refreshToken)
    return res.status(200).json({ok: true})
  } catch (error) {}
}
