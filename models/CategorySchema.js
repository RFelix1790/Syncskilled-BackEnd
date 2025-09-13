import { model, Schema } from "mongoose";
const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);
categorySchema.index({ isActive: 1, name: 1 });
const Category = model("Category", categorySchema);
export default Category;
