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
router.get("/comments/posts/:id", getCommentsByPost);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
export default router;
