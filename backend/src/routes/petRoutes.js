import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensurePetOwnershipFromParam, ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
import {
    getPets,
    getPet,
    unlockPet,
    assignPetToHero,
    unassignPet,
    startPetUpgrade,
    getPetUpgradeStatus,
    finishPetUpgrade,
    cancelPetUpgrade
} from '../controllers/petController.js';

const router = Router();

// GET /api/pets/account/:accountId --------
router.get('/account/:accountId', requireAuth, ensureAccountAccessFromParam('accountId'), getPets);

// GET /api/pets/:id ------
router.get('/:id', requireAuth, ensurePetOwnershipFromParam('id'), getPet);

// POST /api/pets/account/:accountId/unlock
router.post('/account/:accountId/unlock', requireAuth, ensureAccountAccessFromParam('accountId'), unlockPet);

// POST /api/pets/account/:accountId/pets/:petId/assignments ----- 
router.post(
    '/account/:accountId/pets/:petId/assignments',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensurePetOwnershipFromParam('petId'),
    assignPetToHero
);

// DELETE /api/pets/account/:accountId/pets/:petId/assignment ----
router.delete(
    '/account/:accountId/pets/:petId/assignment',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensurePetOwnershipFromParam('petId'),
    unassignPet
);

// POST /api/pets/account/:accountId/pets/:petId/upgrade/start ----
router.post(
    '/account/:accountId/pets/:petId/upgrade/start',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensurePetOwnershipFromParam('petId'),
    startPetUpgrade
);

// POST /api/pets/account/:accountId/pets/:petId/upgrade/finish -----
router.post(
    '/account/:accountId/pets/:petId/upgrade/finish',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensurePetOwnershipFromParam('petId'),
    finishPetUpgrade
);

// POST /api/pets/account/:accountId/pets/:petId/upgrade/cancel -----
router.post(
    '/account/:accountId/pets/:petId/upgrade/cancel',
    requireAuth,
    ensureAccountAccessFromParam('accountId'),
    ensurePetOwnershipFromParam('petId'),
    cancelPetUpgrade
);

// GET /api/pets/:id/upgrade/status
router.get('/:id/upgrade/status', requireAuth, ensurePetOwnershipFromParam('id'), getPetUpgradeStatus);

export default router;