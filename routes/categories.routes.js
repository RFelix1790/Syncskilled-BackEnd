import express from "express";
import {
  listCategoriesService,
  listCategorySkillsService,
} from "../services/category.service.js";

const router = express.Router()

router.get('/categories', listCategoriesService)
router.get('/categories/:id/skills', listCategorySkillsService)

export default router;