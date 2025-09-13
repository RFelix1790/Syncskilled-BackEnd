import express from 'express'
import {refreshIfNeeded, requireAuth} from '../middlewares/auth.middleware.js'
import { meService } from '../services/me.service.js';


const router = express.Router()

router.get('/', refreshIfNeeded, requireAuth,  meService)

export default router; 