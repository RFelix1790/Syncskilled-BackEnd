import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../services/comments.service.js";
const router = express.Router();
router.post("/comments/create", createComment);
router.put("/comments/update/:id", updateComment);
router.delete("/comments/delete/:id", deleteComment);
export default router;
