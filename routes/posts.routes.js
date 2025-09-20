import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getAuthorFromPost,
  getSinglePost,
  updatePost,
  getCommentsByPost,
} from "../services/post.service.js";
router.get("/posts", getAllPosts);
router.get("/posts/:id", getSinglePost);
router.get("/posts/author/:id", getAuthorFromPost);
router.post("/create_post", createPost);
router.put("/update_post/:id", updatePost);
router.delete("/delete_post/:id", deletePost);
router.get("/comments/post/:id", getCommentsByPost);
export default router;
