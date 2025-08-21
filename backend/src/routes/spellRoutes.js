import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensureSpellOwnershipFromParam, ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
import {
    createSpellController,
    getSpellsController,
    getSpellByIdController,
    deleteSpellController,
    startSpellUpgradeController,
    finishSpellUpgradeController,
    cancelSpellUpgradeController,
    getSpellUpgradeStatus
} from '../controllers/spellController.js';

const router = Router();

// GET /api/spells/account/:accountId -----------
router.get('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), getSpellsController);

// POST /api/spells/account/:accountId
router.post('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), createSpellController);

// GET /api/spells/:id ------
router.get('/:id', requireAuth, ensureSpellOwnershipFromParam('id'), getSpellByIdController);

// DELETE /api/spells/:id
router.delete('/:id', requireAuth, ensureSpellOwnershipFromParam('id'), deleteSpellController);

// POST /api/spells/account/:accountId/spells/:spellId/upgrade/start --------
router.post(
    '/account/:accountId/spells/:spellId/upgrade/start',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureSpellOwnershipFromParam('spellId'),
    startSpellUpgradeController
);

// POST /api/spells/account/:accountId/spells/:spellId/upgrade/finish ----
router.post(
    '/account/:accountId/spells/:spellId/upgrade/finish',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureSpellOwnershipFromParam('spellId'),
    finishSpellUpgradeController
);

// POST /api/spells/account/:accountId/spells/:spellId/upgrade/cancel ----
router.post(
    '/account/:accountId/spells/:spellId/upgrade/cancel',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensureSpellOwnershipFromParam('spellId'),
    cancelSpellUpgradeController
);

// GET /api/spells/:id/upgrade/status ----
router.get('/:id/upgrade/status', requireAuth, ensureSpellOwnershipFromParam('id'), getSpellUpgradeStatus);

export default router;