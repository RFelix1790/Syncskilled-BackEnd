import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: "" },
    location: { type: String}, //I removed required for now to enable signup without location
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
const User = model("User", userSchema);
export default User;
