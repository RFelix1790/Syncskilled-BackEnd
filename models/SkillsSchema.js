import { model, Schema } from "mongoose";
const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: { type: String, default: "" },
    isaActive: { type: Boolean, default: false, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
  },

  { timestamps: true }
);
skillsSchema.index({ category: 1, isaActive: 1 });
const Skill = model("Skill", skillSchema);
export default Skill;