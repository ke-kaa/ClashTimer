import {
    getBuildingByIdService,
    getBuildingsByAccountService,
    updateBuildingLevelService,
    startBuildingUpgradeService,
    completeBuildingUpgradeService,
    cancelBuildingUpgradeService,
    getBuildingsByStatusService,
    getBuildingsByTypeService,
    getUpgradeableBuildingsService,
    getMaxedBuildingsService,
    validateBuildingUpgradeService,
    getBuildingsByBuildingTypeService,
    getUpgradingBuildingsService,
    getReadyBuildingsService,
    getBuildingUpgradeProgressService,
    getBuildingStatsService,
} from '../services/buildingService.js';

// getAllBuildings removed: use account-scoped endpoints

export async function getBuildingById(req, res) {
    try {
        const building = await getBuildingByIdService(req.params.id, req.user?.id);
        return res.json(building);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getBuildingsByAccount(req, res) {
    try {
        const { accountId } = req.params;
        const buildings = await getBuildingsByAccountService(req.user?.id, accountId);
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateBuildingLevel(req, res) {
    try {
        const { id } = req.params;
        const { currentLevel } = req.body;
        const building = await updateBuildingLevelService(id, currentLevel);
        return res.json(building);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function startBuildingUpgrade(req, res) {
    try {
        const { id } = req.params;
        const { upgradeCost, upgradeTime } = req.body;
        const building = await startBuildingUpgradeService(id, { upgradeCost, upgradeTime });
        return res.json(building);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function completeBuildingUpgrade(req, res) {
    try {
        const { id } = req.params;
        const building = await completeBuildingUpgradeService(id);
        return res.json(building);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function cancelBuildingUpgrade(req, res) {
    try {
        const { id } = req.params;
        const building = await cancelBuildingUpgradeService(id);
        return res.json(building);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getBuildingsByStatus(req, res) {
    try {
        const { status } = req.params;
        const { accountId } = req.query;
        const buildings = await getBuildingsByStatusService(req.user?.id, accountId, status);
        return res.json(buildings);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getBuildingsByType(req, res) {
    try {
        const { buildingType } = req.params;
        const { accountId } = req.query;
        const buildings = await getBuildingsByTypeService(req.user?.id, accountId, buildingType);
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getUpgradeableBuildings(req, res) {
    try {
        const { accountId } = req.query;
        const buildings = await getUpgradeableBuildingsService(req.user?.id, accountId);
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getMaxedBuildings(req, res) {
    try {
        const { accountId } = req.query;
        const buildings = await getMaxedBuildingsService(req.user?.id, accountId);
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function validateBuildingUpgrade(req, res) {
    try {
        const { id } = req.params;
        const result = await validateBuildingUpgradeService(id);
        return res.json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getBuildingsByBuildingType(req, res) {
    try {
        const { buildingType } = req.params;
        const { accountId } = req.query;
        const buildings = await getBuildingsByBuildingTypeService(req.user?.id, accountId, buildingType);
        return res.json(buildings);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getUpgradingBuildings(req, res) {
    try {
        const { accountId } = req.query;
        const buildings = await getUpgradingBuildingsService(req.user?.id, accountId);

        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getReadyBuildings(req, res) {
    try {
        const { accountId } = req.query;
        const buildings = await getReadyBuildingsService(req.user?.id, accountId);

        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getBuildingUpgradeProgress(req, res) {
    try {
        const { id } = req.params;
        const result = await getBuildingUpgradeProgressService(id);
        return res.json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
}

export async function getBuildingStats(req, res) {
    try {
        const { accountId } = req.params;
        const result = await getBuildingStatsService(accountId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
