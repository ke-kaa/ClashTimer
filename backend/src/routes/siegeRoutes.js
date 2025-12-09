import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
    ensureSiegeOwnershipFromParam,
    ensureAccountAccessFromParam,
} from "../middlewares/ownershipMiddleware.js";
import {
    getSiegesByAccountId,
    getSiegeById,
    unlockSiege,
    getSiegeUpgradeStatus,
    startSiegeUpgrade,
    finishSiegeUpgrade,
    cancelSiegeUpgrade,
    updateSiegeUpgradeTimeController,
} from "../controllers/siegeController.js";

const router = Router();

// GET /api/account/:accountId -----
router.get(
    "/account/:accountId",
    requireAuth,
    ensureAccountAccessFromParam("accountId"),
    getSiegesByAccountId
);

// GET /api/sieges/:id -----
router.get(
    "/:id",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    getSiegeById
);

// POST /api/accounts/:accountId/sieges/unlock
router.post(
    "/account/:accountId/unlock",
    requireAuth,
    ensureAccountAccessFromParam("accountId"),
    unlockSiege
);

// GET /api/sieges/:id/upgrade/status
router.get(
    "/:id/upgrade/status",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    getSiegeUpgradeStatus
);

// POST /api/sieges/:id/upgrade/start -------
router.post(
    "/:accountId/:id/upgrade/start",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    startSiegeUpgrade
);

// POST /api/sieges/:id/upgrade/finish ----
router.post(
    "/:accountId/:id/upgrade/finish",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    finishSiegeUpgrade
);

// POST /api/sieges/:id/upgrade/cancel ----
router.post(
    "/:accountId/:id/upgrade/cancel",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    cancelSiegeUpgrade
);

router.post(
    "/:accountId/:id/upgrade/update",
    requireAuth,
    ensureSiegeOwnershipFromParam("id"),
    updateSiegeUpgradeTimeController
);

export default router;
