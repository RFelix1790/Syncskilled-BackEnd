import Skill from "../models/SkillsSchema.js";

export async function searchSkillsService(req, res) {
  try {
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const active = req.query.active !== "false";
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "50", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const filter = {};
    if (active) filter.isActive = true;
    if (category) filter.category = category;
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
    console.error("searchSkillsService error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getSkillByIdService(req,res){
    try {
        const {id} = req.params
        const skill = await Skill.findById(id)
        if(!skill) return res.status(404).json({error: 'Skill not found'})
            return res.json({skill})
    } catch (error) {
        console.error("getSkillByIdService error:", error);
    return res.status(500).json({ error: "Server error" });
    }
}