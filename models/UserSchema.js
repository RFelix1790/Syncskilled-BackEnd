import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    location: { type: String, index: true },
    profilePhoto: { type: String, default: "" },
    credits: { type: Number, default: 10 },

    skillsToTeach: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: "Skill" },
        creditsPerHour: Number,
        isActive: { type: Boolean, default: true },
      },
    ],

    skillsToLearn: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: "Skill" },
        interestedSince: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
userSchema.index({ location: 1, username: 1 });
userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });
const User = model("User", userSchema);
export default User;
