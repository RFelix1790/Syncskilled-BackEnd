// scripts/seed-skills.js
import "dotenv/config.js";
import mongoose from "mongoose";
import connectDB  from "../config/db.js";
import Category from "../models/CategorySchema.js";
import Skill from "../models/SkillsSchema.js";

const seedData = {
  Languages: [
    { name: "Spanish Conversation", defaultCreditsPerHour: 8 },
    { name: "French Grammar", defaultCreditsPerHour: 10 },
    { name: "English Writing", defaultCreditsPerHour: 12 },
  ],
  Music: [
    { name: "Guitar Basics", defaultCreditsPerHour: 12 },
    { name: "Piano Theory", defaultCreditsPerHour: 15 },
    { name: "Singing Lessons", defaultCreditsPerHour: 10 },
  ],
  Programming: [
    { name: "JavaScript Fundamentals", defaultCreditsPerHour: 20 },
    { name: "React Development", defaultCreditsPerHour: 25 },
    { name: "Python Basics", defaultCreditsPerHour: 18 },
  ],
  "Arts & Crafts": [
    { name: "Watercolor Painting", defaultCreditsPerHour: 10 },
    { name: "Digital Photography", defaultCreditsPerHour: 15 },
  ],
  Fitness: [
    { name: "Yoga for Beginners", defaultCreditsPerHour: 8 },
    { name: "Weight Training", defaultCreditsPerHour: 12 },
  ],
  Cooking: [
    { name: "Italian Cuisine", defaultCreditsPerHour: 14 },
    { name: "Baking Fundamentals", defaultCreditsPerHour: 10 },
  ],
};

async function run() {
  await connectDB();

  for (const [catName, skills] of Object.entries(seedData)) {
    // 1) Ensure category exists
    let category = await Category.findOne({ name: catName });
    if (!category) {
      category = await Category.create({ name: catName, isActive: true });
      console.log(`✅ Created category: ${catName}`);
    }

    // 2) Upsert skills in this category
    for (const s of skills) {
      const updated = await Skill.findOneAndUpdate(
        { category: category._id, name: s.name }, // match by category+name
        {
          $set: {
            description: s.description || "",
            defaultCreditsPerHour: s.defaultCreditsPerHour,
            isActive: true,
          },
        },
        {
          upsert: true,             // create if not exist
          new: true,                // return the updated/new doc
          runValidators: true,      // ensure schema rules apply
        }
      );
      console.log(`⚡ Upserted skill: ${updated.name} (slug: ${updated.slug})`);
    }
  }

  await mongoose.disconnect();
  console.log("🎉 Skill seeding complete.");
}

run().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await mongoose.disconnect();
  process.exit(1);
});
