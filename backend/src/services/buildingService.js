import mongoose from "mongoose";
import Building from "../models/Building.js";
import Account from "../models/Account.js";

async function ensureAccountOwned(userId, accountId) {
    const acc = await Account.findOne({ _id: accountId, owner: userId }).select(
        "_id"
    );
    if (!acc) {
        const err = new Error("Account not found");
        err.status = 404;
        throw err;
    }
}

export async function getBuildingByIdService(id, userId) {
    const building = await Building.findById(id).populate(
        "account",
        "username townHallLevel owner"
    );
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (
        userId &&
        building.account &&
        building.account.owner?.toString &&
        building.account.owner.toString() !== userId.toString()
    ) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
    return building;
}

export async function getBuildingsByAccountService(userId, accountId) {
    await ensureAccountOwned(userId, accountId);
    return Building.find({ account: accountId }).populate(
        "account",
        "username townHallLevel"
    );
}

export async function updateBuildingLevelService(id, currentLevel) {
    if (
        currentLevel === undefined ||
        !Number.isInteger(currentLevel) ||
        currentLevel < 0
    ) {
        const err = new Error(
            "Invalid current level. Must be a non-negative integer."
        );
        err.status = 400;
        throw err;
    }
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (currentLevel > building.maxLevel) {
        const err = new Error("Current level cannot exceed maximum level");
        err.status = 400;
        throw err;
    }
    building.currentLevel = currentLevel;
    await building.save();
    return building;
}

export async function startBuildingUpgradeService(
    id,
    { upgradeCost, upgradeTime }
) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (building.status === "Upgrading") {
        const err = new Error("Building is already upgrading");
        err.status = 400;
        throw err;
    }
    if (building.currentLevel >= building.maxLevel) {
        const err = new Error("Building is already at maximum level");
        err.status = 400;
        throw err;
    }
    const now = new Date();
    const upgradeEndTime = new Date(now.getTime() + (upgradeTime || 0) * 1000);
    building.status = "Upgrading";
    building.upgradeStartTime = now;
    building.upgradeEndTime = upgradeEndTime;
    building.upgradeCost = upgradeCost || 0;
    building.upgradeTime = upgradeTime || 0;
    await building.save();
    return building;
}

export async function completeBuildingUpgradeService(id) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (building.status !== "Upgrading") {
        const err = new Error("Building is not currently upgrading");
        err.status = 400;
        throw err;
    }
    if (building.currentLevel >= building.maxLevel) {
        const err = new Error("Building is already at maximum level");
        err.status = 400;
        throw err;
    }
    building.currentLevel += 1;
    building.status = "Idle";
    building.upgradeStartTime = null;
    building.upgradeEndTime = null;
    building.upgradeCost = 0;
    building.upgradeTime = 0;
    await building.save();
    await Account.findByIdAndUpdate(building.account, {
        $inc: { totalUpgrades: 1 },
    });
    return building;
}

export async function cancelBuildingUpgradeService(id) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (building.status !== "Upgrading") {
        const err = new Error("Building is not currently upgrading");
        err.status = 400;
        throw err;
    }
    building.status = "Idle";
    building.upgradeStartTime = null;
    building.upgradeEndTime = null;
    await building.save();
    return building;
}

export async function updateBuildingUpgradeTimeService(id, { upgradeTime }) {
    if (upgradeTime === undefined || upgradeTime === null) {
        const err = new Error("upgradeTime is required");
        err.status = 400;
        throw err;
    }
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (building.status !== "Upgrading") {
        const err = new Error("Building is not currently upgrading");
        err.status = 400;
        throw err;
    }

    const durationMs = Number(upgradeTime) * 1000;
    if (!Number.isFinite(durationMs) || durationMs < 0) {
        const err = new Error("upgradeTime must be a non-negative number");
        err.status = 400;
        throw err;
    }

    const startTime = building.upgradeStartTime || new Date();
    building.upgradeStartTime = startTime;
    building.upgradeEndTime = new Date(startTime.getTime() + durationMs);
    building.upgradeTime = Number(upgradeTime);
    await building.save();
    return building;
}

export async function getBuildingsByStatusService(userId, accountId, status) {
    if (!["Idle", "Upgrading"].includes(status)) {
        const err = new Error('Invalid status. Must be "Idle" or "Upgrading"');
        err.status = 400;
        throw err;
    }
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = { status, account: accountId };
    return Building.find(query).populate("account", "username townHallLevel");
}

export async function getBuildingsByTypeService(
    userId,
    accountId,
    buildingType
) {
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = {
        name: { $regex: buildingType, $options: "i" },
        account: accountId,
    };
    return Building.find(query).populate("account", "username townHallLevel");
}

export async function getUpgradeableBuildingsService(userId, accountId) {
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = {
        account: accountId,
        status: "Idle",
        $expr: { $lt: ["$currentLevel", "$maxLevel"] },
    };
    return Building.find(query).populate("account", "username townHallLevel");
}

export async function getMaxedBuildingsService(userId, accountId) {
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = {
        account: accountId,
        $expr: { $eq: ["$currentLevel", "$maxLevel"] },
    };
    return Building.find(query).populate("account", "username townHallLevel");
}

export async function validateBuildingUpgradeService(id) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    const canUpgrade =
        building.status === "Idle" && building.currentLevel < building.maxLevel;
    return {
        canUpgrade,
        currentLevel: building.currentLevel,
        maxLevel: building.maxLevel,
        status: building.status,
        reason: canUpgrade
            ? "Building can be upgraded"
            : building.status === "Upgrading"
            ? "Building is currently upgrading"
            : building.currentLevel >= building.maxLevel
            ? "Building is at maximum level"
            : "Unknown reason",
    };
}

export async function getBuildingsByBuildingTypeService(
    userId,
    accountId,
    buildingType
) {
    if (
        ![
            "Resource",
            "Defense",
            "Army",
            "Storage",
            "Wall",
            "Trap",
            "Special",
        ].includes(buildingType)
    ) {
        const err = new Error("Invalid building type");
        err.status = 400;
        throw err;
    }
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = { buildingType, account: accountId };
    return Building.find(query).populate("account", "username townHallLevel");
}

export async function getUpgradingBuildingsService(userId, accountId) {
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const query = { status: "Upgrading", account: accountId };
    return Building.find(query)
        .populate("account", "username townHallLevel")
        .sort({ upgradeEndTime: 1 });
}

export async function getReadyBuildingsService(userId, accountId) {
    if (!accountId) {
        const err = new Error("accountId is required");
        err.status = 400;
        throw err;
    }
    await ensureAccountOwned(userId, accountId);
    const now = new Date();
    const query = {
        status: "Upgrading",
        upgradeEndTime: { $lte: now },
        account: accountId,
    };
    return Building.find(query)
        .populate("account", "username townHallLevel")
        .sort({ upgradeEndTime: 1 });
}

export async function getBuildingUpgradeProgressService(id) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error("Building not found");
        err.status = 404;
        throw err;
    }
    if (building.status !== "Upgrading") {
        const err = new Error("Building is not currently upgrading");
        err.status = 400;
        throw err;
    }
    const now = new Date();
    const totalTime = building.upgradeTime * 1000;
    const elapsedTime = now.getTime() - building.upgradeStartTime.getTime();
    const progress = Math.min(
        100,
        Math.max(0, (elapsedTime / totalTime) * 100)
    );
    const timeRemaining = Math.max(
        0,
        building.upgradeEndTime.getTime() - now.getTime()
    );
    return {
        building,
        progress: Math.round(progress),
        timeRemaining: Math.round(timeRemaining / 1000),
        isReady: timeRemaining <= 0,
    };
}

export async function getBuildingStatsService(accountId) {
    const stats = await Building.aggregate([
        { $match: { account: new mongoose.Types.ObjectId(accountId) } },
        {
            $group: {
                _id: null,
                totalBuildings: { $sum: 1 },
                maxedBuildings: {
                    $sum: {
                        $cond: [{ $eq: ["$currentLevel", "$maxLevel"] }, 1, 0],
                    },
                },
                upgradingBuildings: {
                    $sum: { $cond: [{ $eq: ["$status", "Upgrading"] }, 1, 0] },
                },
                idleBuildings: {
                    $sum: { $cond: [{ $eq: ["$status", "Idle"] }, 1, 0] },
                },
                totalUpgrades: { $sum: "$currentLevel" },
            },
        },
    ]);

    const buildingTypeStats = await Building.aggregate([
        { $match: { account: new mongoose.Types.ObjectId(accountId) } },
        {
            $group: {
                _id: "$buildingType",
                count: { $sum: 1 },
                maxed: {
                    $sum: {
                        $cond: [{ $eq: ["$currentLevel", "$maxLevel"] }, 1, 0],
                    },
                },
            },
        },
    ]);

    return {
        overall: stats[0] || {
            totalBuildings: 0,
            maxedBuildings: 0,
            upgradingBuildings: 0,
            idleBuildings: 0,
            totalUpgrades: 0,
        },
        byType: buildingTypeStats,
    };
}
