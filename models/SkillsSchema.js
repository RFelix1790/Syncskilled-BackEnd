import { model, Schema } from "mongoose";
const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    isaActive: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },

  { timestamps: true }
);
const Skill = model("Skill", skillSchema);
export default Skill;
