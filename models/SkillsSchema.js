// models/SkillsSchema.js
import { model, Schema } from "mongoose";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const skillsSchema = new Schema(
  {
    // REL: each skill belongs to exactly one Category
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true, // unique inside a category
    },

    description: { type: String, default: "", maxlength: 240 },
    defaultCreditsPerHour: { type: Number, min: 0, max: 9999, default: 0 },
    isActive: { type: Boolean, default: true, index: true },

    // optional tags for search later
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// keep slug synced with name
skillsSchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// Uniqueness: no duplicate skill names within the same category
skillsSchema.index({ category: 1, slug: 1 }, { unique: true });

// Common query paths
skillsSchema.index({ category: 1, isActive: 1 });
skillsSchema.index({ name: 1 });
skillsSchema.index({ tags: 1 });

const Skill = model("Skill", skillsSchema);
export default Skill;
