import mongoose from "mongoose";
import Category from "../models/CategorySchema.js";
import Skill from "../models/SkillsSchema.js";
import { paged, parsePaging } from "../utils/paging.js";
import { safeRegex } from "../utils/search.js";
import { resolveByIdOrSlug } from "../utils/ids.js";

export async function listCategoriesService(req, res) {
  try {
    const active = req.query.active !== "false";

    const { page, limit, skip } = parsePaging(req.query, {
      defaultLimit: 50,
      maxLimit: 100,
    });

    const filter = active ? { isActive: true } : {};
    const [items, total] = await Promise.all([
      Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    return res.json(paged(items, page, limit, total));
  } catch (error) {
    console.error("list Categories Service error", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listCategorySkillsService(req, res) {
  try {
    const { id: idOrSlug } = req.params;

    // Resolve by ObjectId OR slug
    const category = await resolveByIdOrSlug(Category, idOrSlug, { select: "_id name isActive" });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const active = req.query.active !== "false";
    const rx = safeRegex(req.query.q);
    const { page, limit, skip } = parsePaging(req.query, { defaultLimit: 50, maxLimit: 100 });

    const filter = { category: category._id, ...(active ? { isActive: true } : {}) };
    if (rx) filter.name = rx;

    const [items, total] = await Promise.all([
      Skill.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Skill.countDocuments(filter),
    ]);

    return res.json(paged(items, page, limit, total));
  } catch (error) {
    console.error("listCategorySkillsService error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
