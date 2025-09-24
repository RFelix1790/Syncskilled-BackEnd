// services/me.skills.service.js
import User from "../models/UserSchema.js";
import Skill from "../models/SkillsSchema.js";
import { resolveByIdOrSlug } from "../utils/ids.js";

// POST /api/me/teach
export async function addTeachSkillService(req, res) {
  try {
    const idOrSlug = req.body.skill ?? req.body.skillId;
    if (!idOrSlug) return res.status(400).json({ error: "Missing skill" });

    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id name isActive defaultCreditsPerHour" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    if (skill.isActive === false) return res.status(400).json({ error: "Skill is not active" });

let creditsPerHour;
if (req.body.creditsPerHour !== undefined) {
  const n = Number(req.body.creditsPerHour);
  if (!Number.isFinite(n) || n < 0 || n > 9999) {
    return res
      .status(400)
      .json({ error: "creditsPerHour must be between 0 and 9999" });
  }
  creditsPerHour = n;
} else {
  // fallback: use skill’s defaultCreditsPerHour or 0
  creditsPerHour = skill.defaultCreditsPerHour;
}

    const exists = await User.findOne({
      _id: req.user._id,
      "skillsToTeach.skillId": skill._id,
    }).select("_id");
    if (exists) return res.status(409).json({ error: "You already teach this skill" });

    const push = { skillId: skill._id, isActive: true };
    if (creditsPerHour !== undefined) push.creditsPerHour = Number(creditsPerHour);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { skillsToTeach: push } },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(201).json({
      ok: true,
      added: { skillId: String(skill._id), name: skill.name, creditsPerHour: push.creditsPerHour ?? null, isActive: true },
      user: updated,
    });
  } catch (error) {
    console.error("[addTeachSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/me/teach/:id
export async function removeTeachSkillService(req, res) {
  try {
    const { id: idOrSlug } = req.params;
    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { skillsToTeach: { skillId: skill._id } } },
      { new: true }
    ).select("-password");

    return res.json({ ok: true, removed: { skillId: String(skill._id) }, user: updated });
  } catch (error) {
    console.error("[removeTeachSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/me/learn  { skill: "<id-or-slug>" }
export async function addLearnSkillService(req, res) {
  try {
    const idOrSlug = req.body.skill ?? req.body.skillId;
    if (!idOrSlug) return res.status(400).json({ error: "Missing skill" });

    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id name isActive" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    if (skill.isActive === false) return res.status(400).json({ error: "Skill is not active" });

    const exists = await User.findOne({
      _id: req.user._id,
      "skillsToLearn.skillId": skill._id,
    }).select("_id");
    if (exists) return res.status(409).json({ error: "Already in your learn list" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { skillsToLearn: { skillId: skill._id, interestedSince: new Date() } } },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(201).json({
      ok: true,
      added: { skillId: String(skill._id), name: skill.name },
      user: updated,
    });
  } catch (error) {
    console.error("[addLearnSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/me/learn/:id
export async function removeLearnSkillService(req, res) {
  try {
    const { id: idOrSlug } = req.params;
    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { skillsToLearn: { skillId: skill._id } } },
      { new: true }
    ).select("-password");

    return res.json({ ok: true, removed: { skillId: String(skill._id) }, user: updated });
  } catch (error) {
    console.error("[removeLearnSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}
