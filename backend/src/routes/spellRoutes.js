import { Router } from 'express';
import {
    createSpellController,
    getSpellsController,
    getSpellByIdController,
    deleteSpellController,
    startSpellUpgradeController,
    finishSpellUpgradeController,
    getSpellUpgradeStatus
} from '../controllers/spellController.js';

const router = Router();

// GET /api/spells?accountId=...
router.get('/', getSpellsController);

// POST /api/spells
router.post('/', createSpellController);

// GET /api/spells/:id
router.get('/:id', getSpellByIdController);

// DELETE /api/spells/:id
router.delete('/:id', deleteSpellController);

// POST /api/spells/upgrade/start
router.post('/upgrade/start', startSpellUpgradeController);

// POST /api/spells/upgrade/finish
router.post('/upgrade/finish', finishSpellUpgradeController);

// GET /api/spells/:id/upgrade/status
router.get('/:id/upgrade/status', getSpellUpgradeStatus);

export default router;