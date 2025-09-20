import Skill from "../models/SkillsSchema.js";
import { parsePaging, paged } from "../utils/paging.js";
import { safeRegex } from "../utils/search.js";
import { resolveByIdOrSlug } from "../utils/ids.js";

export async function searchSkillsService(req, res) {
  try {
    const rx = safeRegex(req.query.q);
    const category = (req.query.category || "").trim();
    const active = req.query.active !== "false";
    const { page, limit, skip } = parsePaging(req.query, {
      defaultLimit: 50,
      maxLimit: 100,
    });

    const filter = {};
    if (active) filter.isActive = true;
    if (category) filter.category = category;
    if (rx) filter.name = rx;

    const [items, total] = await Promise.all([
      Skill.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Skill.countDocuments(filter),
    ]);

    return res.json(paged(items, page, limit, total));
  } catch (error) {
    console.error("searchSkillsService error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getSkillByIdService(req, res) {
  try {
    const { id: idOrSlug } = req.params;
    const skill = await resolveByIdOrSlug(Skill, idOrSlug, { select: "" });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    await skill.populate({ path: "category", select: "name" });

    return res.json({ skill });
  } catch (error) {
    console.error("getSkillByIdService error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
