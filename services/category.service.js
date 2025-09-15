import mongoose from "mongoose";
import Category from "../models/CategorySchema.js";
import Skill from "../models/SkillsSchema.js";

export async function listCategoriesService(req, res) {
  try {
    const active = req.query.active !== "false";
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "50", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const filter = active ? { isActive: true } : {};
    const [items, total] = await Promise.all([
      Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("list Categories Service error", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function listCategorySkillsService(req, res) {
  try {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: 'Invalid category id'})
    }

    const category = await Category.findById(id).select('_id isActive name')
    if(!category){
      return res.status(404).json({error: 'Category not found'})
    }




    const active = req.query.active !== "false";
    const q = (req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "50", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const exists = await Category.exists({ _id: id });
    if (!exists) return res.status(404).json({ error: "Category not found" });

    const filter = { category: id, ...(active ? { isActive: true } : {}) };
    if (q) {
      filter.name = {
        $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const [items, total] = await Promise.all([
      Skill.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Skill.countDocuments(filter),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("listCategorySkillsService error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
