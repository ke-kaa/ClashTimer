import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensureHeroOwnershipFromParam, ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
import {
    getAllHeroes,
    getHeroesByAccount,
    getHeroById,
    updateHeroLevel,
    startHeroUpgrade,
    completeHeroUpgrade,
    cancelHeroUpgrade,
    getHeroesByStatus,
    getHeroUpgradeProgress,
    validateHeroUpgrade,
    getTopHeroes
} from '../controllers/heroController.js';

const router = Router();

// GET /api/heroes
// router.get('/', requireAuth, getAllHeroes);

//  http://localhost:port/api/heroes/status/Upgrading?accountId
//  http://localhost:port/api/heroes/status/Idle?accountId
// GET /api/heroes/status/:status?accountId=... -----
router.get('/status/:status', requireAuth, getHeroesByStatus);

// GET /api/accounts/:accountId/heroes ------
router.get('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), getHeroesByAccount);

// GET /api/accounts/:accountId/heroes/top  -----
router.get('/account/:accountId/top', requireAuth, ensureAccountAccessFromParam('accountId'), getTopHeroes);

// GET /api/heroes/:id ------
router.get('/:id', requireAuth, ensureHeroOwnershipFromParam('id'), getHeroById);

// PATCH /api/heroes/:id/level ----
router.patch('/:id/level', requireAuth, ensureHeroOwnershipFromParam('id'), updateHeroLevel);

// POST /api/heroes/:id/upgrade/start -----
router.post('/:id/upgrade/start', requireAuth, ensureHeroOwnershipFromParam('id'), startHeroUpgrade);

// POST /api/heroes/:id/upgrade/finish -----
router.post('/:id/upgrade/finish', requireAuth, ensureHeroOwnershipFromParam('id'), completeHeroUpgrade);

// POST /api/heroes/:id/upgrade/cancel ---- 
router.post('/:id/upgrade/cancel', requireAuth, ensureHeroOwnershipFromParam('id'), cancelHeroUpgrade);

// GET /api/heroes/:id/upgrade/status ---- 
router.get('/:id/upgrade/status', requireAuth, ensureHeroOwnershipFromParam('id'), getHeroUpgradeProgress);

// GET /api/heroes/:id/upgrade/validate ---- 
router.get('/:id/upgrade/validate', requireAuth, ensureHeroOwnershipFromParam('id'), validateHeroUpgrade);

export default router;