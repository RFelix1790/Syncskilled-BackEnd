import express from "express";
import {
  searchSkillsService,
  getSkillByIdService,
} from "../services/skills.service.js";

import {
  listPeopleOfferingSkillService,
  listPeopleWantingSkillService,
} from "../services/skills-people.service.js";

const router = express.Router();

router.get("/skills", searchSkillsService);
router.get("/skills/:id", getSkillByIdService);

router.get("/skills/:id/people/offer", listPeopleOfferingSkillService);
router.get("/skills/:id/people/want", listPeopleWantingSkillService);

export default router;
