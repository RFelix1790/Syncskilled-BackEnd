import { Schema, model } from "mongoose";
const CommentsSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    comment: { type: String, required: true, maxlength: 240 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    like: { type: Number, default: 0 },
    unlike: { type: Number, default: 0 },
  },
  { timestamps: true }
);
CommentsSchema.index({ author: 1 });
CommentsSchema.index({ post: 1 });
const Comment = model("Comment", CommentsSchema);
export default Comment;
