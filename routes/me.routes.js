import express from 'express'
import {refreshIfNeeded, requireAuth} from '../middlewares/auth.middleware.js'
import {  getMeService,
  patchMeService,
  changeMyPasswordService,} from '../services/me.service.js';


const router = express.Router()
router.use(refreshIfNeeded, requireAuth);

router.get('/', getMeService)
router.patch('/', patchMeService);
router.put('/password', changeMyPasswordService);

export default router;