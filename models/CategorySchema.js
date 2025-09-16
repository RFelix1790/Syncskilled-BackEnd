import { model, Schema } from "mongoose";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // human-visible unique
      trim: true,
      maxlength: 60,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // URL/lookup key; prevents case issues
      index: true,
    },
    description: { type: String, default: "", maxLength: 240 },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// keep slug in sync
categorySchema.pre("validate", function (next) {
  if (this.isModified("name")) this.slug = slugify(this.name);
  next();
});

// helpful sort/filter path
categorySchema.index({ isActive: 1, name: 1 });

const Category = model("Category", categorySchema);
export default Category;
