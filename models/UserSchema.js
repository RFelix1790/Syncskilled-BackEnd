import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, required: true, index: true },
    profilePhoto: { type: String, default: "" },
    skillsToTeach: [{ type: Schema.Types.ObjectId, ref: "Skill", index: true }],
    skillsToLearn: [{ type: Schema.Types.ObjectId, ref: "Skill", index: true }],
  },
  { timestamps: true }
);
userSchema.index({ location: 1, userName: 1 });
userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });
const User = model("User", userSchema);
export default User;
