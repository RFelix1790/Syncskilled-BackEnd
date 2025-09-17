import { Schema, model } from "mongoose";
const CommentsSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comment: { type: String, require: true, maxlenght: 240 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Comment = model("Comment", CommentsSchema);
export default Comment;
