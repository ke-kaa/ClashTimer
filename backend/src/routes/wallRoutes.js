import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
import { getWallGroup, upgradeWallLevels, getWallStats } from '../controllers/wallController.js';

const router = Router();

router.get('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), getWallGroup);

router.patch('/account/:accountId/upgrade', requireAuth, ensureAccountAccessFromParam('accountId'), upgradeWallLevels);

router.get('/account/:accountId/stats', requireAuth, ensureAccountAccessFromParam('accountId'), getWallStats);

export default router;
