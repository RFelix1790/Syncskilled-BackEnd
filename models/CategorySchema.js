import { model, Schema } from "mongoose";
const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Category = model("Category", categorySchema);
export default Category;
