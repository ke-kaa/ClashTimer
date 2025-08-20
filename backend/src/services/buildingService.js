import mongoose from 'mongoose';
import Building from '../models/Building.js';
import Account from '../models/Account.js';

async function ensureAccountOwned(userId, accountId) {
    const acc = await Account.findOne({ _id: accountId, owner: userId }).select('_id');
    if (!acc) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }
}

export async function getBuildingByIdService(id, userId) {
    const building = await Building.findById(id).populate('account', 'username townHallLevel owner');
    if (!building) {
        const err = new Error('Building not found');
        err.status = 404;
        throw err;
    }
    if (userId && building.account && building.account.owner?.toString && building.account.owner.toString() !== userId.toString()) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }
    return building;
}

export async function getBuildingsByAccountService(userId, accountId) {
    await ensureAccountOwned(userId, accountId);
    return Building.find({ account: accountId }).populate('account', 'username townHallLevel');
}


export async function updateBuildingLevelService(id, currentLevel) {
    if (currentLevel === undefined || !Number.isInteger(currentLevel) || currentLevel < 0) {
        const err = new Error('Invalid current level. Must be a non-negative integer.');
        err.status = 400;
        throw err;
    }
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error('Building not found');
        err.status = 404;
        throw err;
    }
    if (currentLevel > building.maxLevel) {
        const err = new Error('Current level cannot exceed maximum level');
        err.status = 400;
        throw err;
    }
    building.currentLevel = currentLevel;
    await building.save();
    return building;
    }

    export async function startBuildingUpgradeService(id, { upgradeCost, upgradeTime }) {
    const building = await Building.findById(id);
    if (!building) {
        const err = new Error('Building not found');
        err.status = 404;
        throw err;
    }
    if (building.status === 'Upgrading') {
        const err = new Error('Building is already upgrading');
        err.status = 400;
        throw err;
    }
    if (building.currentLevel >= building.maxLevel) {
        const err = new Error('Building is already at maximum level');
        err.status = 400;
        throw err;
    }
    const now = new Date();
    const upgradeEndTime = new Date(now.getTime() + (upgradeTime || 0) * 1000);
    building.status = 'Upgrading';
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
        const err = new Error('Building not found');
        err.status = 404;
        throw err;
    }
    if (building.status !== 'Upgrading') {
        const err = new Error('Building is not currently upgrading');
        err.status = 400;
        throw err;
    }
    if (building.currentLevel >= building.maxLevel) {
        const err = new Error('Building is already at maximum level');
        err.status = 400;
        throw err;
    }
    building.currentLevel += 1;
    building.status = 'Idle';
    building.upgradeStartTime = null;
    building.upgradeEndTime = null;
    building.upgradeCost = 0;
    building.upgradeTime = 0;
    await building.save();
    await Account.findByIdAndUpdate(building.account, { $inc: { totalUpgrades: 1 } });
    return building;
}