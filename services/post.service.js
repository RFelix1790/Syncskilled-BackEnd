import PostModel from "../models/PostSchema.js";
import UserModel from "../models/UserSchema.js";
import CommentModel from "../models/CommentsSchema.js";
export async function getAllPosts(req, res) {
  try {
    const posts = await PostModel.find().populate(
      "author",
      "username email  profilePhoto -_id"
    );
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function getSinglePost(req, res) {
  try {
    const singlePost = await PostModel.findById(req.params.id)
      .populate("author", "username email  profilePhoto -_id")
      .populate({
        path: "comments",
        select: "like unlike comment -_id",
        populate: { path: "author", select: "username profilePhoto -_id" },
      });
    if (!singlePost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(singlePost);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function getAuthorFromPost(req, res) {
  try {
    const authorOfPost = await PostModel.findById(req.params.id)
      .select("author")
      .populate("author", "username email  profilePhoto");
    if (!authorOfPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ authorId: authorOfPost.author });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function createPost(req, res) {
  try {
    const newPost = new PostModel(req.body);
    const savedPost = await newPost.save();
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { posts: savedPost._id } },
      { new: true }
    );
    const populatedPost = await savedPost.populate(
      "author",
      "username email  profilePhoto"
    );
    res.status(201).json({ message: "created post", Post: populatedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function updatePost(req, res) {
  try {
    const postId = req.params.id;
    const postIdExist = PostModel.findById(postId);

    if (!postIdExist) return res.status(404).json({ error: "Post not found" });

    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    // if (!updatedPost) {
    //   return res.status(404).json({ error: "Post not found" });
    // }

    res.status(200).json({ message: "Post Updated", Post: updatedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const postIdExist = PostModel.findById(postId);
    if (!postIdExist) return res.status(404).json({ error: "Post not found" });
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    //if (!deletedPost) {
    //return res.status(404).json({ error: "Post not found" });
    //}
    await CommentModel.deleteMany({ post: req.params.id });
    await UserModel.findByIdAndUpdate(
      deletedPost.author,
      { $pull: { posts: req.params.id } },
      { new: true }
    );
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function getCommentsByPost(req, res) {
  try {
    const postId = req.params.id;
    const postIdExists = PostModel.findById(postId);
    if (!postIdExists) return res.status(404).json({ error: "Post not found" });
    const comments = await PostModel.findById(postId)
      .populate({ path: "author", select: "username -_id" })
      .populate({
        path: "comments",
        select: "comment author like unlike -_id",
        populate: { path: "author", select: "username profilePhoto -_id" },
      });
    return res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
