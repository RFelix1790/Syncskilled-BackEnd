import User from "../models/UserSchema.js";
import { comparePassword, hashPassword } from "../utils/security.js";

// GET /api/me
export async function getMeService(req, res) {
  return res.json({ user: req.user });
}

// PATCH /api/me
export async function patchMeService(req, res) {
  try {
    const { name, bio, location, profilePhoto, username, email } = req.body || {};
    const updates = {};

    // Whitelist + light validation
    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof bio === "string") updates.bio = bio.slice(0, 200);
    if (typeof location === "string") updates.location = location.slice(0, 80);
    if (typeof profilePhoto === "string") updates.profilePhoto = profilePhoto.trim();

    // Optional: username/email (uniqueness checks)
    if (typeof username === "string" && username.trim()) {
      const uname = username.toLowerCase().trim();
      const isTaken = await User.findOne({ username: uname, _id: { $ne: req.user._id } });
      if (isTaken) return res.status(409).json({ error: "Username already taken" });
      updates.username = uname;
    }

    if (typeof email === "string" && email.trim()) {
      const mail = email.toLowerCase().trim();
      const isTaken = await User.findOne({ email: mail, _id: { $ne: req.user._id } });
      if (isTaken) return res.status(409).json({ error: "Email already in use" });
      updates.email = mail;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json({ user: updated });
  } catch (error) {
    console.error("User update failed", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// PUT /api/me/password
export async function changeMyPasswordService(req, res) {
  try {
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }
    if (String(newPassword).length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isOldPasswordMatched = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordMatched) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.json({ ok: true });
  } catch (error) {
    console.error("Password change failed", error);
    return res.status(500).json({ error: "Server error" });
  }
}