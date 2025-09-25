import express from "express";
import {
  refreshIfNeeded,
  requireAuth,
} from "../middlewares/auth.middleware.js";
import {
  changeMyPasswordService,
  getMeService,
  patchMeService,
} from "../services/me.service.js";
import {
  addTeachSkillService,
  removeTeachSkillService,
  addLearnSkillService,
  removeLearnSkillService,
} from "../services/me.skills.service.js";

const router = express.Router();
router.use(refreshIfNeeded, requireAuth);

router.get("/", getMeService);
router.patch("/", patchMeService);
router.put("/change-password", changeMyPasswordService);

router.post("/teach", addTeachSkillService);
router.delete("/teach/:id", removeTeachSkillService);
router.post("/learn", addLearnSkillService);
router.delete("/learn/:id", removeLearnSkillService);
export default router;
