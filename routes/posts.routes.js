import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getAuthorFromPost,
  getSinglePost,
  updatePost,
} from "../services/post.service.js";
router.get("/posts", getAllPosts);
router.get("/posts/:id", getSinglePost);
router.get("/posts/:id/author", getAuthorFromPost);
router.post("/create_post", createPost);
router.put("/update_post/:id", updatePost);
router.delete("/delete_post/:id", deletePost);
export default router;
