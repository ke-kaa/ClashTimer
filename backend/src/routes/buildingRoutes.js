import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
    ensureBuildingOwnershipFromParam,
    ensureAccountAccessFromParam,
    ensureAccountAccessFromBody,
} from "../middlewares/ownershipMiddleware.js";
import {
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
    getBuildingStats,
} from "../controllers/buildingController.js";

const router = Router();

// requires accountId as a query parameter
// GET /api/buildings/upgrading -----
router.get("/upgrading", requireAuth, getUpgradingBuildings);

// GET /api/buildings/ready -----
router.get("/ready", requireAuth, getReadyBuildings);

// GET /api/buildings/upgradeable -----
router.get("/upgradeable", requireAuth, getUpgradeableBuildings);

// GET /api/buildings/maxed -----
router.get("/maxed", requireAuth, getMaxedBuildings);

// add accountId as query parameter
// GET /api/buildings/status/:status -----
router.get("/status/:status", requireAuth, getBuildingsByStatus);

// add accountId as query parameter
// GET /api/buildings/type/:buildingType ----
router.get("/type/:buildingType", requireAuth, getBuildingsByType);

// GET /api/buildings/category/:buildingType -----
router.get("/category/:buildingType", requireAuth, getBuildingsByBuildingType);

// GET /api/buildings/:id ----
router.get(
    "/:id",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    getBuildingById
);

// GET /api/buildings/:id/upgrade/status ----
router.get(
    "/:id/upgrade/status",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    getBuildingUpgradeProgress
);

// GET /api/buildings/:id/upgrade/validate ----
router.get(
    "/:id/upgrade/validate",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    validateBuildingUpgrade
);

// PATCH /api/buildings/:id/level ----
router.patch(
    "/:id/level",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    updateBuildingLevel
);

// POST /api/buildings/:id/upgrade/start ----
router.post(
    ":accountId/:id/upgrade/start",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    startBuildingUpgrade
);

// POST /api/buildings/:id/upgrade/finish -----
router.post(
    "/:accountId/:id/upgrade/finish",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    completeBuildingUpgrade
);

// POST /api/buildings/:id/upgrade/cancel ----
router.post(
    "/:accountId/:id/upgrade/cancel",
    requireAuth,
    ensureBuildingOwnershipFromParam("id"),
    cancelBuildingUpgrade
);

// GET /api/accounts/:accountId/buildings ----
router.get(
    "/account/:accountId/list",
    requireAuth,
    ensureAccountAccessFromParam("accountId"),
    getBuildingsByAccount
);

// GET /api/accounts/:accountId/buildings/stats ----
router.get(
    "/account/:accountId/stats",
    requireAuth,
    ensureAccountAccessFromParam("accountId"),
    getBuildingStats
);

export default router;
