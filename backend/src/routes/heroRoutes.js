import { Router } from 'express';
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
router.get('/', getAllHeroes);

// GET /api/heroes/status/:status?accountId=...
router.get('/status/:status', getHeroesByStatus);

// GET /api/accounts/:accountId/heroes
router.get('/account/:accountId', getHeroesByAccount);

// GET /api/accounts/:accountId/heroes/top
router.get('/account/:accountId/top', getTopHeroes);

// GET /api/heroes/:id
router.get('/:id', getHeroById);

// PATCH /api/heroes/:id/level
router.patch('/:id/level', updateHeroLevel);

// POST /api/heroes/:id/upgrade/start
router.post('/:id/upgrade/start', startHeroUpgrade);

// POST /api/heroes/:id/upgrade/finish
router.post('/:id/upgrade/finish', completeHeroUpgrade);

// POST /api/heroes/:id/upgrade/cancel
router.post('/:id/upgrade/cancel', cancelHeroUpgrade);

// GET /api/heroes/:id/upgrade/status
router.get('/:id/upgrade/status', getHeroUpgradeProgress);

// GET /api/heroes/:id/upgrade/validate
router.get('/:id/upgrade/validate', validateHeroUpgrade);

export default router;