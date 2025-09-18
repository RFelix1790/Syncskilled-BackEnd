import commentsModel from "../models/CommentsSchema.js";
import postModel from "../models/PostSchema.js";
import userModel from "../models/UserSchema.js";

export async function createComment(req, res) {
  try {
    const createdComment = await new commentsModel(req.body);
    const savedComment = await createdComment.save();
    await postModel.findByIdAndUpdate(
      req.body.post,
      { $push: { comments: savedComment._id } },
      { new: true }
    );
    const populatedComment = await savedComment.populate([
      { path: "author", select: "username email profilePhoto" },
      { path: "post", select: "title" },
    ]);
    res
      .status(201)
      .json({ message: "comment created", comment: populatedComment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function updateComment(req, res) {
  try {
    const commentId = req.params.id;
    const commentIdExist = await commentsModel.findById(commentId);
    if (!commentIdExist)
      return res.status(404).json({ error: "comment not found" });
    const updatedComment = await commentsModel
      .findByIdAndUpdate(commentId, req.body, { new: true })
      .populate("author", "username email profilePhoto")
      .populate("post", "title");
    res
      .status(200)
      .json({ message: "comment updated", comment: updatedComment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const commentIdExist = await commentsModel.findById(commentId);
    if (!commentIdExist)
      return res.status(404).json({ error: "comment not found" });
    const deletedComment = await commentsModel.findByIdAndDelete(commentId);
    await postModel.findByIdAndUpdate(
      deletedComment.post,
      { $pull: { comments: commentId } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "comment deleted", comment: deletedComment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
