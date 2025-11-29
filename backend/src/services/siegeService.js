import Account  from '../models/Account.js';
import  Siege  from '../models/Siege.js';
import { computeUpgradeStatus } from '../utils/computeUpgradeStatusUtils.js';
import { startUpgrade } from '../utils/upgradeUtils.js';
import { canFinishUpgrade, finishUpgrade } from '../utils/upgradeUtils.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

import mongoose from 'mongoose';

export async function unlockSiegeService({ accountId, input }) {
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
        throw { status: 400, message: 'Invalid accountId format' };
    }

    const account = await Account.findById(accountId).select('townHallLevel sieges');
    if (!account) {
        throw { status: 404, message: 'Account not found' };
    }

    const normalizedType = input;

    // Duplicate check
    const existing = await Siege.findOne({ account: accountId, siegeType: normalizedType });
    if (existing) {
        throw { status: 409, message: 'Siege already unlocked' };
    }

    const th = account.townHallLevel;
    const thConfig = itemsByTownHall?.[th];
    if (!thConfig || !Array.isArray(thConfig.sieges)) {
        throw { status: 400, message: `No siege configuration for Town Hall ${th}` };
    }
    const normalizeKey = (s = '') => s.toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
    const targetKey = normalizeKey(normalizedType);
    const siegeEntry = thConfig.sieges.find(s => normalizeKey(s.siegeName) === targetKey);
    if (!siegeEntry) {
        throw {
            status: 404,
            message: 'Siege not available at this Town Hall',
            availableSieges: thConfig.sieges.map(s => s.siegeName)
        };
    }

    const derivedMaxLevel = siegeEntry.maxLevel ?? 1;

    const siege = await Siege.create({
        name: normalizedType,
        siegeType: normalizedType,
        currentLevel: 0,
        maxLevel: derivedMaxLevel,
        account: accountId
    });

    // Maintain reference if schema needs it
    if (Array.isArray(account.sieges)) {
        account.sieges.push(siege._id);
        await account.save();
    }

    return siege;
}

export function getSiegeUpgradeStatusService(siege) {
    return computeUpgradeStatus(siege);
}

export async function startSiegeUpgradeService(siegeId, upgradeTimeSec, upgradeCost) {
    const siege = await Siege.findById(siegeId);
    if (!siege) throw new Error('Siege not found');

    return await startUpgrade(siege, upgradeTimeSec, upgradeCost);
}

export async function finishSiegeUpgradeService(siegeId) {
    const siege = await Siege.findById(siegeId);
    if (!siege) {
        throw { status: 404, message: 'Siege not found' };
    }

    if (!canFinishUpgrade(siege)) {
        throw { status: 400, message: 'No active upgrade or upgrade not finished yet' };
    }

    const updatedSiege = finishUpgrade(siege);
    await updatedSiege.save();
    return updatedSiege;
}

export async function cancelSiegeUpgradeService(siegeId) {
    const siege = await Siege.findById(siegeId);
    if (!siege) {
        throw { status: 404, message: 'Siege not found' };
    }

    if (siege.status !== 'Upgrading') {
        throw { status: 400, message: 'Siege not currently upgrading' };
    }

    siege.status = 'Idle';
    siege.upgradeStartTime = null;
    siege.upgradeEndTime = null;
    siege.upgradeCost = 0;
    siege.upgradeTime = 0;
    await siege.save();
    return siege;
}
