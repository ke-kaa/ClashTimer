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
