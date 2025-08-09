import { Router } from 'express';
import {
    createTroopController,
    getTroopsByAccountIdController,
    getTroopByIdController,
    deleteTroopController,
    startTroopUpgradeController,
    finishTroopUpgradeController,
    getTroopUpgradeStatus
} from '../controllers/troopController.js';

const router = Router();

// GET /api/troops?accountId=...
router.get('/', getTroopsByAccountIdController);

// POST /api/troops
router.post('/', createTroopController);

// GET /api/troops/:id
router.get('/:id', getTroopByIdController);

// DELETE /api/troops/:id
router.delete('/:id', deleteTroopController);

// POST /api/troops/upgrade/start
router.post('/upgrade/start', startTroopUpgradeController);

// POST /api/troops/upgrade/finish
router.post('/upgrade/finish', finishTroopUpgradeController);

// GET /api/troops/:id/upgrade/status
router.get('/:id/upgrade/status', getTroopUpgradeStatus);

export default router;