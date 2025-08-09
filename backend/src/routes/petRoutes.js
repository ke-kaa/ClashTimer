import { Router } from 'express';
import {
    getPets,
    getPet,
    unlockPet,
    assignPetToHero,
    unassignPet,
    startPetUpgrade,
    getPetUpgradeStatus,
    finishPetUpgrade
} from '../controllers/petController.js';

const router = Router();

// GET /api/pets?accountId=...
router.get('/', getPets);

// GET /api/pets/:id
router.get('/:id', getPet);

// POST /api/pets/unlock
router.post('/unlock', unlockPet);

// POST /api/pets/assign
router.post('/assign', assignPetToHero);

// POST /api/pets/unassign
router.post('/unassign', unassignPet);

// POST /api/pets/upgrade/start
router.post('/upgrade/start', startPetUpgrade);

// POST /api/pets/upgrade/finish
router.post('/upgrade/finish', finishPetUpgrade);

// GET /api/pets/:id/upgrade/status
router.get('/:id/upgrade/status', getPetUpgradeStatus);

export default router;