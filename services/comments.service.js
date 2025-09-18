import commentsModel from "../models/CommentsSchema.js";
import postModel from "../models/PostSchema.js";
import userModel from "../models/UserSchema.js";
export async function getAllComments(req, res) {
  try {
    const comments = await commentsModel
      .find()
      .populate("author", "username email")
      .populate("post", "title");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getCommentsByPost(req, res) {
  try {
    const comments = await commentsModel
      .find({ post: req.params.id })
      .populate("author", "username email");
    return res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCommentsByUser(req, res) {
  try {
    const comments = await commentsModel
      .find({ author: req.params.id })
      .populate("post", "title");
    return res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function createComment(req, res) {
  try {
    const createdComment = await new commentsModel(req.body);
    const savedComment = await createdComment.save();
    await userModel.findByIdAndUpdate(
      req.body.author,
      {
        $push: { comments: savedComment._id },
      },
      { new: true }
    );
    await postModel.findByIdAndUpdate(
      req.body.post,
      { $push: { comments: savedComment._id } },
      { new: true }
    );
    const populatedComment = await savedComment.populate([
      { path: "author", select: "username email" },
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
    const updatedComment = await commentsModel
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("author", "username email")
      .populate("post", "title");
    if (!updatedComment) {
      return res.status(404).json({ error: "comment not found" });
    }
    res
      .status(200)
      .json({ message: "comment updated", comment: updatedComment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function deleteComment(req, res) {
  try {
    const deletedComment = await commentsModel.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ error: "comment not found" });
    }
    await userModel.findByIdAndUpdate(
      deletedComment.author,
      {
        $pull: { comments: req.params.id },
      },
      { new: true }
    );
    await postModel.findByIdAndUpdate(
      deletedComment.post,
      { $pull: { comments: req.params.id } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "comment deleted", comment: deletedComment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
