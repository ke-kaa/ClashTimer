import { Router } from 'express';
import {
    getAllBuildings,
    getBuildingById,
    getBuildingsByAccount,
    updateBuildingLevel,
    startBuildingUpgrade,
    completeBuildingUpgrade,
    cancelBuildingUpgrade,
    getBuildingsByStatus,
    getBuildingsByType,
    getUpgradeableBuildings,
    getMaxedBuildings,
    validateBuildingUpgrade,
    getBuildingsByBuildingType,
    getUpgradingBuildings,
    getReadyBuildings,
    getBuildingUpgradeProgress,
    getBuildingStats
} from '../controllers/buildingController.js';

const router = Router();

// GET /api/buildings
router.get('/', getAllBuildings);

// GET /api/buildings/upgrading
router.get('/upgrading', getUpgradingBuildings);

// GET /api/buildings/ready
router.get('/ready', getReadyBuildings);

// GET /api/buildings/upgradeable
router.get('/upgradeable', getUpgradeableBuildings);

// GET /api/buildings/maxed
router.get('/maxed', getMaxedBuildings);

// GET /api/buildings/status/:status
router.get('/status/:status', getBuildingsByStatus);

// GET /api/buildings/type/:buildingType
router.get('/type/:buildingType', getBuildingsByType);

// GET /api/buildings/category/:buildingType
router.get('/category/:buildingType', getBuildingsByBuildingType);

// GET /api/buildings/:id
router.get('/:id', getBuildingById);

// GET /api/buildings/:id/upgrade/status
router.get('/:id/upgrade/status', getBuildingUpgradeProgress);

// GET /api/buildings/:id/upgrade/validate
router.get('/:id/upgrade/validate', validateBuildingUpgrade);

// PATCH /api/buildings/:id/level
router.patch('/:id/level', updateBuildingLevel);

// POST /api/buildings/:id/upgrade/start
router.post('/:id/upgrade/start', startBuildingUpgrade);

// POST /api/buildings/:id/upgrade/finish
router.post('/:id/upgrade/finish', completeBuildingUpgrade);

// POST /api/buildings/:id/upgrade/cancel
router.post('/:id/upgrade/cancel', cancelBuildingUpgrade);

// GET /api/accounts/:accountId/buildings
router.get('/account/:accountId/list', getBuildingsByAccount);

// GET /api/accounts/:accountId/buildings/stats
router.get('/account/:accountId/stats', getBuildingStats);

export default router;