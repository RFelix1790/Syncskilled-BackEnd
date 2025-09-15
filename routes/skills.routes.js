import express from "express";
import {
  searchSkillsService,
  getSkillByIdService,
} from "../services/skills.service.js";

const router = express.Router();

router.get("/skills", searchSkillsService);

router.get("/skills/:id", getSkillByIdService);

export default router;
