import express from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentsByPost,
  getCommentsByUser,
  updateComment,
} from "../services/comments.service.js";
const router = express.Router();
router.get("/comments", getAllComments);
router.get("/comments/post/:id", getCommentsByPost);
router.get("/comments/author/:id", getCommentsByUser);
router.post("/comments/create", createComment);
router.put("/comments/update/:id", updateComment);
router.delete("/comments/delete/:id", deleteComment);
export default router;
