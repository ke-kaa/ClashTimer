import { Router } from 'express';
import {
    getSiegesByAccountId,
    getSiegeById,
    unlockSiege,
    getSiegeUpgradeStatus,
    startSiegeUpgrade,
    finishSiegeUpgrade
} from '../controllers/siegeController.js';

const router = Router();

// GET /api/sieges?accountId=...
router.get('/', getSiegesByAccountId);

// GET /api/accounts/:accountId/sieges
router.get('/account/:accountId', getSiegesByAccountId);

// GET /api/sieges/:id
router.get('/:id', getSiegeById);

// POST /api/sieges/unlock
router.post('/unlock', unlockSiege);

// GET /api/sieges/:id/upgrade/status
router.get('/:id/upgrade/status', getSiegeUpgradeStatus);

// POST /api/sieges/upgrade/start
router.post('/upgrade/start', startSiegeUpgrade);

// POST /api/sieges/upgrade/finish
router.post('/upgrade/finish', finishSiegeUpgrade);

export default router;