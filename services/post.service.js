import PostModel from "../models/PostSchema.js";
import UserModel from "../models/UserSchema.js";
export async function getAllPosts(req, res) {
  try {
    const posts = await PostModel.find();
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function getSinglePost(req, res) {
  try {
    const singlePost = await PostModel.findById(req.params.id);
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
    const authorOfPost = await PostModel.findById(req.params.id).select(
      "author"
    );
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
    res.status(201).json({ message: "created post", Post: savedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function updatePost(req, res) {
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post Updated", Post: updatedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
export async function deletePost(req, res) {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $pull: { posts: req.params.id } },
      { new: true }
    );
    res.status(200).json({ message: "Post deleted", Post: deletedPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
