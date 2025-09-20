// models/SkillsSchema.js
import { model, Schema } from "mongoose";
import { slugify } from "../utils/slugify.js";

const skillsSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, index: true, required: true },
    description: { type: String, default: "" },
    defaultCreditsPerHour: { type: Number, min: 0, max: 9999, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Ensure slug exists on create/save
skillsSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// Ensure slug is set for findOneAndUpdate / upserts too
skillsSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const filter = this.getFilter() || {};

  // get name from update first, else from $set, else from filter (match)
  const name =
    update.name ??
    (update.$set && update.$set.name) ??
    filter.name;

  // if caller already sets slug explicitly, don't override
  const slugIsBeingSet =
    update.slug !== undefined ||
    (update.$set && update.$set.slug !== undefined);

  if (name && !slugIsBeingSet) {
    const newSlug = slugify(name);
    if (update.$set) update.$set.slug = newSlug;
    else update.slug = newSlug;
    this.setUpdate(update);
  }

  next();
});

// Unique per category
skillsSchema.index(
  { category: 1, slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $exists: true, $ne: "" } } }
);

skillsSchema.index({ category: 1, isActive: 1 });
skillsSchema.index({ name: 1 });
skillsSchema.index({ tags: 1 });

const Skill = model("Skill", skillsSchema);
export default Skill;
