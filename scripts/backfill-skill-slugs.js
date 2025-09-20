// scripts/backfill-skill-slugs.js
import "dotenv/config.js";
import mongoose from "mongoose";
import  connectDB  from "../config/db.js";
import Skill from "../models/SkillsSchema.js";
import { slugify } from "../utils/slugify.js";

async function run() {
  await connectDB();

  const cursor = Skill.find({ $or: [{ slug: { $exists: false } }, { slug: "" }] })
    .select("_id name category slug")
    .cursor();

  let count = 0;

  for await (const doc of cursor) {
    const newSlug = slugify(doc.name) || String(doc._id).slice(-8);
    await Skill.findByIdAndUpdate(
      doc._id,
      { $set: { slug: newSlug } },
      { new: false }
    );
    count++;
  }

  console.log(`✅ Backfilled ${count} slugs.`);
  await mongoose.disconnect();
}
run().catch(async (e) => {
  console.error("❌ Backfill failed:", e);
  await mongoose.disconnect();
  process.exit(1);
});
