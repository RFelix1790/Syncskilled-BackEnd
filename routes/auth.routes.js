import express from "express";
import {
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "../services/auth.service.js";

const router = express.Router();

router.post("/register", registerService);
router.post("/login", loginService);
router.post("/logout", logoutService);
router.get("/refresh", refreshService);

export default router;
 