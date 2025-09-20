import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, default: "", maxlength: 240 },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillToLearn: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    skillToTeach: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      index: true,
    },
    exchangeCredits: { type: Number, required: true, min: 1, max: 9999 },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
    location: { type: String, maxlength: 240 },
    isActive: { type: Boolean, default: true, index: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", index: true }],
  },
  { timestamps: true }
);
PostSchema.index({ author: 1 });
PostSchema.index({ skillToTeach: 1, isActive: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ comments: 1 });
const Post = model("Post", PostSchema);
export default Post;
