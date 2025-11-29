import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensureTroopOwnershipFromParam, ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
import {
    createTroopController,
    getTroopsByAccountIdController,
    getTroopByIdController,
    deleteTroopController,
    startTroopUpgradeController,
    finishTroopUpgradeController,
    cancelTroopUpgradeController,
    getTroopUpgradeStatus
} from '../controllers/troopController.js';

const router = Router();

// GET /api/troops/account/:accountId -----
router.get('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), getTroopsByAccountIdController);

// POST /api/troops/account/:accountId
router.post('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), createTroopController);

// GET /api/troops/:id -----
router.get('/:id', requireAuth, ensureTroopOwnershipFromParam('id'), getTroopByIdController);

// DELETE /api/troops/:id
router.delete('/:id', requireAuth, ensureTroopOwnershipFromParam('id'), deleteTroopController);

// POST /api/troops/account/:accountId/troops/:troopId/upgrade/start
router.post(
    '/account/:accountId/troops/:troopId/upgrade/start',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureTroopOwnershipFromParam('troopId'),
    startTroopUpgradeController
);

// POST /api/troops/account/:accountId/troops/:troopId/upgrade/finish
router.post(
    '/account/:accountId/troops/:troopId/upgrade/finish',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureTroopOwnershipFromParam('troopId'),
    finishTroopUpgradeController
);

// POST /api/troops/account/:accountId/troops/:troopId/upgrade/cancel
router.post(
    '/account/:accountId/troops/:troopId/upgrade/cancel',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureTroopOwnershipFromParam('troopId'),
    cancelTroopUpgradeController
);

// GET /api/troops/:id/upgrade/status
router.get('/:id/upgrade/status', requireAuth, ensureTroopOwnershipFromParam('id'), getTroopUpgradeStatus);

export default router;