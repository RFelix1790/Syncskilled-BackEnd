import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    skillsToTeach: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    skillsToLearn: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  },
  { timestamps: true }
);
const User = model("User", userSchema);
export default User;
