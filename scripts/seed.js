// scripts/seed.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/CategorySchema.js';
import Skill from '../models/SkillsSchema.js';
import connectDB  from '../config/db.js';

async function run() {
  await connectDB();

  // --- 1) Seed Categories ---
  const categories = [
    { name: 'Languages',    description: 'Learn to speak new languages', icon: 'languages' },
    { name: 'Music',        description: 'Instruments, vocals, theory',  icon: 'music' },
    { name: 'Programming',  description: 'Coding and software skills',    icon: 'code' },
    { name: 'Arts & Crafts',description: 'Creative and artistic skills',  icon: 'arts' },
    { name: 'Fitness',      description: 'Training and wellness',         icon: 'fitness' },
    { name: 'Cooking',      description: 'Culinary skills & recipes',     icon: 'cooking' },
  ];

  // upsert categories by slug (slug is set by pre-validate hook)
  const catDocs = [];
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate(
      { name: c.name },         // unique by name/slug
      { $set: { ...c, isActive: true } },
      { new: true, upsert: true }
    );
    catDocs.push(doc);
  }

  // helper: grab a category id by name
  const catId = (name) => catDocs.find(c => c.name === name)?._id;

  // --- 2) Seed Skills (each tied to a category) ---
  const skills = [
    // Languages
    { category: catId('Languages'),   name: 'Spanish Conversation', description: 'Practical speaking practice', defaultCreditsPerHour: 8 },
    { category: catId('Languages'),   name: 'French Grammar',       description: 'Foundations & usage',         defaultCreditsPerHour: 10 },
    { category: catId('Languages'),   name: 'English Writing',      description: 'Essays & clarity',            defaultCreditsPerHour: 12 },

    // Music
    { category: catId('Music'),       name: 'Guitar Basics',        description: 'Chords, strumming, rhythm',   defaultCreditsPerHour: 12 },
    { category: catId('Music'),       name: 'Piano Theory',         description: 'Scales, harmony, reading',    defaultCreditsPerHour: 15 },
    { category: catId('Music'),       name: 'Singing Lessons',      description: 'Breath & pitch control',      defaultCreditsPerHour: 10 },

    // Programming
    { category: catId('Programming'), name: 'JavaScript Fundamentals', description: 'Syntax, DOM, async',       defaultCreditsPerHour: 20 },
    { category: catId('Programming'), name: 'React Development',       description: 'Components & hooks',       defaultCreditsPerHour: 25 },
    { category: catId('Programming'), name: 'Python Basics',           description: 'Scripts & data types',     defaultCreditsPerHour: 18 },

    // Arts & Crafts
    { category: catId('Arts & Crafts'), name: 'Watercolor Painting', description: 'Brushwork & color',          defaultCreditsPerHour: 10 },
    { category: catId('Arts & Crafts'), name: 'Digital Photography', description: 'Composition & editing',      defaultCreditsPerHour: 15 },

    // Fitness
    { category: catId('Fitness'),     name: 'Yoga for Beginners',   description: 'Mobility & breath',           defaultCreditsPerHour: 8 },
    { category: catId('Fitness'),     name: 'Weight Training',      description: 'Form & programming',          defaultCreditsPerHour: 12 },

    // Cooking
    { category: catId('Cooking'),     name: 'Italian Cuisine',      description: 'Pasta & sauces',              defaultCreditsPerHour: 14 },
    { category: catId('Cooking'),     name: 'Baking Fundamentals',  description: 'Doughs & ovens',              defaultCreditsPerHour: 10 },
  ].filter(s => s.category); // safeguard if a category failed to insert

  for (const s of skills) {
    await Skill.findOneAndUpdate(
      { category: s.category, name: s.name }, // unique per category via (category, slug)
      { $set: { ...s, isActive: true } },
      { new: true, upsert: true }
    );
  }

  console.log('✅ Seed complete.');
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error('❌ Seed failed:', e);
  await mongoose.disconnect();
  process.exit(1);
});
