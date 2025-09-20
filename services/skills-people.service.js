import User from "../models/UserSchema.js";
import Skill from "../models/SkillsSchema.js";
import { parsePaging, paged } from "../utils/paging.js";
import { resolveByIdOrSlug } from "../utils/ids.js";

export async function listPeopleOfferingSkillService(req, res) {
  try {
    const { id: idOrSlug } = req.params;
    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id name" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const { page, limit, skip } = parsePaging(req.query, { defaultLimit: 20 });
    const location = (req.query.location || "").trim();

    const match = {
      "skillsToTeach.skillId": skill._id,
      "skillsToTeach.isActive": true,
      ...(location ? { location } : {}),
    };

    const [items, total] = await Promise.all([
      User.find(match)
        .select("username name location profilePhoto credits skillsToTeach")
        .skip(skip).limit(limit),
      User.countDocuments(match),
    ]);

    const shaped = items.map(u => {
      const teach = (u.skillsToTeach || []).find(s => String(s.skillId) === String(skill._id));
      return {
        id: u._id,
        username: u.username,
        name: u.name,
        location: u.location || "",
        profilePhoto: u.profilePhoto || "",
        credits: u.credits,
        creditsPerHour: teach?.creditsPerHour ?? null,
      };
    });

    return res.json({ skill: { id: skill._id, name: skill.name }, ...paged(shaped, page, limit, total) });
  } catch (error) {
    console.error("[listPeopleOfferingSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listPeopleWantingSkillService(req, res) {
  try {
    const { id: idOrSlug } = req.params;
    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "_id name" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const { page, limit, skip } = parsePaging(req.query, { defaultLimit: 20 });
    const location = (req.query.location || "").trim();

    const match = { "skillsToLearn.skillId": skill._id, ...(location ? { location } : {}) };

    const [items, total] = await Promise.all([
      User.find(match).select("username name location profilePhoto credits").skip(skip).limit(limit),
      User.countDocuments(match),
    ]);

    const shaped = items.map(u => ({
      id: u._id,
      username: u.username,
      name: u.name,
      location: u.location || "",
      profilePhoto: u.profilePhoto || "",
      credits: u.credits,
    }));

    return res.json({ skill: { id: skill._id, name: skill.name }, ...paged(shaped, page, limit, total) });
  } catch (error) {
    console.error("[listPeopleWantingSkillService]", error);
    return res.status(500).json({ error: "Server error" });
  }
}
