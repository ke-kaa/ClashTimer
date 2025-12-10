import Troop from "../models/Troop.js";
import Account from "../models/Account.js";
import { normalizeKey } from "../utils/convertUtils.js";
import { itemsByTownHall } from "../utils/itemsByTownHall.js";
import {
    startUpgrade,
    finishUpgrade,
    canFinishUpgrade,
} from "../utils/upgradeUtils.js";
import { computeUpgradeStatus } from "../utils/computeUpgradeStatusUtils.js";

function createError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function requireUserId(userId) {
    if (!userId) {
        throw createError("Authentication required", 401);
    }
}

async function assertAccountOwnership(userId, accountId, projection) {
    requireUserId(userId);
    if (!accountId) {
        throw createError("accountId is required", 400);
    }

    const query = Account.findOne({ _id: accountId, owner: userId });
    query.select(projection ?? "_id");

    const account = await query;
    if (!account) {
        throw createError("Account not found", 404);
    }
    return account;
}

async function findOwnedTroopById(userId, troopId) {
    requireUserId(userId);
    if (!troopId) {
        throw createError("troopId is required", 400);
    }

    const troop = await Troop.findById(troopId);
    if (!troop) {
        throw createError("Troop not found", 404);
    }

    const ownsAccount = await Account.exists({
        _id: troop.account,
        owner: userId,
    });
    if (!ownsAccount) {
        throw createError("Forbidden", 403);
    }

    return troop;
}

export async function createTroopService(
    userId,
    accountId,
    { name, troopName, currentLevel } = {}
) {
    const account = await assertAccountOwnership(
        userId,
        accountId,
        "townHallLevel troops"
    );

    const inputName = name || troopName;
    if (!inputName) {
        throw createError("troop name is required", 400);
    }

    const thLevel = account.townHallLevel;
    const thConfig = itemsByTownHall?.[thLevel];
    if (!thConfig || !Array.isArray(thConfig.troops)) {
        throw createError(
            `No troop configuration for Town Hall ${thLevel}`,
            400
        );
    }

    const targetKey = normalizeKey(inputName);
    const troopEntry = thConfig.troops.find(
        (s) => normalizeKey(s.troopName ?? s.name) === targetKey
    );
    if (!troopEntry) {
        const err = createError("troop not available at this Town Hall", 404);
        err.availableTroops = thConfig.troops
            .map((s) => s.troopName ?? s.name)
            .filter(Boolean);
        throw err;
    }

    const canonicalName = troopEntry.troopName ?? troopEntry.name;
    const derivedMaxLevel = troopEntry.maxLevel ?? 1;
    const derivedType = troopEntry.type ?? "Elixir";
    const derivedHousing = troopEntry.housingSpace ?? 1;

    const duplicate = await Troop.findOne({
        account: accountId,
        name: canonicalName,
    });
    if (duplicate) {
        throw createError("troop already exists for this account", 409);
    }

    const lvl = currentLevel ?? 0;
    if (lvl < 0 || lvl > derivedMaxLevel) {
        throw createError(
            `currentLevel must be between 0 and ${derivedMaxLevel}`,
            400
        );
    }

    const troop = new Troop({
        name: canonicalName,
        troopType: derivedType,
        currentLevel: lvl,
        maxLevel: derivedMaxLevel,
        housingSpace: derivedHousing,
        status: "Idle",
        account: accountId,
    });
    await troop.save();

    if (Array.isArray(account.troops)) {
        account.troops.push(troop._id);
        await account.save();
    } else {
        await Account.findByIdAndUpdate(accountId, {
            $addToSet: { troops: troop._id },
        });
    }

    return troop;
}

export async function getTroopsByAccountService(userId, accountId) {
    await assertAccountOwnership(userId, accountId);
    return Troop.find({ account: accountId }).sort({ createdAt: -1 });
}

export async function getTroopByIdService(userId, troopId) {
    return findOwnedTroopById(userId, troopId);
}

export async function deleteTroopService(userId, troopId) {
    const troop = await findOwnedTroopById(userId, troopId);
    await Account.findByIdAndUpdate(troop.account, {
        $pull: { troops: troop._id },
    });
    await troop.deleteOne();
    return { deleted: true, troopId: troop._id };
}

export async function startTroopUpgradeService(
    userId,
    accountId,
    { troopId, upgradeTime, upgradeCost } = {}
) {
    await assertAccountOwnership(userId, accountId);
    if (!troopId) {
        throw createError("troopId required", 400);
    }
    if (upgradeTime === undefined || upgradeTime === null) {
        throw createError("upgradeTime required", 400);
    }

    const time = Number(upgradeTime);
    if (!Number.isFinite(time) || time < 0) {
        throw createError("upgradeTime must be a non-negative number", 400);
    }

    const troop = await findOwnedTroopById(userId, troopId);
    if (troop.account.toString() !== accountId.toString()) {
        throw createError("Troop does not belong to this account", 403);
    }
    if (troop.status === "Upgrading") {
        throw createError("Troop already upgrading", 409);
    }
    if (troop.currentLevel >= troop.maxLevel) {
        throw createError("Troop already at max level", 400);
    }

    if (time === 0) {
        troop.currentLevel = Math.min(troop.currentLevel + 1, troop.maxLevel);
        troop.status = "Idle";
        troop.upgradeStartTime = null;
        troop.upgradeEndTime = null;
        troop.upgradeTime = 0;
        troop.upgradeCost = Number(upgradeCost) || 0;
        await troop.save();
        return { troop, instant: true };
    }

    const now = new Date();
    troop.status = "Upgrading";
    troop.upgradeStartTime = now;
    troop.upgradeEndTime = new Date(now.getTime() + time * 1000);
    troop.upgradeTime = time;
    troop.upgradeCost = Number(upgradeCost) || 0;
    await troop.save();
    return troop;
}

export async function updateTroopUpgradeTimeService(
    userId,
    accountId,
    { troopId, upgradeTime } = {}
) {
    await assertAccountOwnership(userId, accountId);
    if (!troopId) {
        throw createError("troopId required", 400);
    }
    if (upgradeTime === undefined || upgradeTime === null) {
        throw createError("upgradeTime required", 400);
    }

    const time = Number(upgradeTime);
    if (!Number.isFinite(time) || time < 0) {
        throw createError("upgradeTime must be a non-negative number", 400);
    }

    const troop = await findOwnedTroopById(userId, troopId);
    if (troop.account.toString() !== accountId.toString()) {
        throw createError("Troop does not belong to this account", 403);
    }
    if (troop.status !== "Upgrading") {
        throw createError("Troop is not upgrading", 409);
    }
    if (troop.currentLevel >= troop.maxLevel) {
        throw createError("Troop already at max level", 400);
    }

    // if (time === 0) {
    //     troop.currentLevel = Math.min(troop.currentLevel + 1, troop.maxLevel);
    //     troop.status = "Idle";
    //     troop.upgradeStartTime = null;
    //     troop.upgradeEndTime = null;
    //     troop.upgradeTime = 0;
    //     troop.upgradeCost = Number(upgradeCost) || 0;
    //     await troop.save();
    //     return { troop, instant: true };
    // }

    const startTime = troop.upgradeStartTime || new Date();
    troop.upgradeStartTime = startTime;
    troop.upgradeEndTime = new Date(startTime.getTime() + durationMs);
    troop.upgradeTime = Number(upgradeTime);
    await troop.save();
    return troop;
}

export async function finishTroopUpgradeService(
    userId,
    accountId,
    { troopId } = {}
) {
    await assertAccountOwnership(userId, accountId);
    if (!troopId) {
        throw createError("troopId required", 400);
    }

    const troop = await findOwnedTroopById(userId, troopId);
    if (troop.account.toString() !== accountId.toString()) {
        throw createError("Troop does not belong to this account", 403);
    }
    if (troop.status !== "Upgrading") {
        throw createError("Troop not upgrading", 400);
    }
    // if (!canFinishUpgrade(troop)) {
    //     throw createError('No active upgrade or upgrade not finished yet', 400);
    // }

    finishUpgrade(troop);
    await troop.save();
    return troop;
}

export async function cancelTroopUpgradeService(
    userId,
    accountId,
    { troopId } = {}
) {
    await assertAccountOwnership(userId, accountId);
    if (!troopId) {
        throw createError("troopId required", 400);
    }

    const troop = await findOwnedTroopById(userId, troopId);
    if (troop.account.toString() !== accountId.toString()) {
        throw createError("Troop does not belong to this account", 403);
    }
    if (troop.status !== "Upgrading") {
        throw createError("Troop not upgrading", 400);
    }

    troop.status = "Idle";
    troop.upgradeStartTime = null;
    troop.upgradeEndTime = null;
    troop.upgradeTime = 0;
    troop.upgradeCost = 0;
    await troop.save();
    return troop;
}

export async function getTroopUpgradeStatusService(userId, troopId) {
    const troop = await findOwnedTroopById(userId, troopId);
    return computeUpgradeStatus(troop);
}
