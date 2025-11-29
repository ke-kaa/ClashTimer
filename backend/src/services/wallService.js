import Account from '../models/Account.js';
import WallGroup from '../models/WallGroup.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

function resolveTownHallWallConfig(townHallLevel) {
	if (!Number.isInteger(townHallLevel)) return null;
	const thData = itemsByTownHall[townHallLevel];
	if (!thData || !thData.walls) return null;
	const { count, currentLevel, maxLevel } = thData.walls;
	if (!Number.isInteger(count) || count < 0) return null;
	if (!Number.isInteger(maxLevel) || maxLevel < 1) return null;
	const startLevel = Number.isInteger(currentLevel) ? Math.max(0, currentLevel) : 0;
	const levels = count > 0 ? [{ level: startLevel, count }] : [];
	return { levels, maxLevel: Math.max(1, maxLevel), totalAllowed: count };
}

async function getAccountForUser(userId, accountId) {
	const account = await Account.findOne({ _id: accountId, owner: userId }).select('_id townHallLevel walls');
	if (!account) {
		const err = new Error('Account not found');
		err.status = 404;
		throw err;
	}
	return account;
}

export async function createWallGroupForTownHall({ accountId, townHallLevel }, { session } = {}) {
	const config = resolveTownHallWallConfig(townHallLevel);
	if (!config) return null;
	const existingQuery = WallGroup.findOne({ account: accountId });
	if (session) existingQuery.session(session);
	const existing = await existingQuery;
	if (existing) return existing;
	const payload = {
		account: accountId,
		maxLevel: config.maxLevel,
		levels: config.levels
	};
	if (session) {
		const [wallGroup] = await WallGroup.create([payload], { session });
		return wallGroup;
	}
	return WallGroup.create(payload);
}

export async function getWallGroupService({ userId, accountId }) {
	const account = await getAccountForUser(userId, accountId);
	const config = resolveTownHallWallConfig(account.townHallLevel);
	let wallGroup = await WallGroup.findOne({ account: accountId });
	if (!wallGroup && config) {
		wallGroup = await createWallGroupForTownHall({ accountId, townHallLevel: account.townHallLevel });
		if (wallGroup && !account.walls) {
			await Account.findByIdAndUpdate(accountId, { walls: wallGroup._id });
		}
	}
	if (!wallGroup) {
		return {
			account: accountId,
			maxLevel: config?.maxLevel ?? 0,
			levels: [],
			totalAllowed: config?.totalAllowed ?? 0
		};
	}
	const wallGroupData = wallGroup.toObject();
	return {
		...wallGroupData,
		totalAllowed: config?.totalAllowed ?? wallGroupData.levels.reduce((sum, lvl) => sum + lvl.count, 0)
	};
}

export async function upgradeWallLevelsService({ userId, accountId, fromLevel, toLevel, count }) {
	const account = await getAccountForUser(userId, accountId);
	const config = resolveTownHallWallConfig(account.townHallLevel);
	if (!config) {
		const err = new Error('Walls are not available for this Town Hall level');
		err.status = 400;
		throw err;
	}

	if (!Number.isInteger(fromLevel) || fromLevel < 0) {
		const err = new Error('fromLevel must be a non-negative integer');
		err.status = 400;
		throw err;
	}
	if (!Number.isInteger(toLevel) || toLevel <= fromLevel) {
		const err = new Error('toLevel must be an integer greater than fromLevel');
		err.status = 400;
		throw err;
	}
	if (!Number.isInteger(count) || count <= 0) {
		const err = new Error('count must be a positive integer');
		err.status = 400;
		throw err;
	}

	let wallGroup = await WallGroup.findOne({ account: accountId });
	if (!wallGroup) {
		wallGroup = await createWallGroupForTownHall({ accountId, townHallLevel: account.townHallLevel });
		if (!wallGroup) {
			const err = new Error('No wall data available for this account');
			err.status = 404;
			throw err;
		}
		if (!account.walls) {
			await Account.findByIdAndUpdate(accountId, { walls: wallGroup._id });
		}
	}

	if (toLevel > wallGroup.maxLevel) {
		const err = new Error(`Cannot upgrade beyond wall max level ${wallGroup.maxLevel}`);
		err.status = 400;
		throw err;
	}

	const fromEntry = wallGroup.levels.find(lvl => lvl.level === fromLevel);
	if (!fromEntry || fromEntry.count < count) {
		const err = new Error('Not enough walls at the specified current level to upgrade');
		err.status = 400;
		throw err;
	}

	fromEntry.count -= count;
	let toEntry = wallGroup.levels.find(lvl => lvl.level === toLevel);
	if (toEntry) {
		toEntry.count += count;
	} else {
		wallGroup.levels.push({ level: toLevel, count });
	}

	wallGroup.levels = wallGroup.levels.filter(lvl => lvl.count > 0).sort((a, b) => a.level - b.level);

	const total = wallGroup.levels.reduce((sum, lvl) => sum + lvl.count, 0);
	if (total > config.totalAllowed) {
		const err = new Error(`Total walls ${total} exceeds Town Hall limit ${config.totalAllowed}`);
		err.status = 400;
		throw err;
	}

	await wallGroup.save();

	return {
		wallGroup,
		totalAllowed: config.totalAllowed
	};
}

export async function getWallStatsService({ userId, accountId }) {
	const data = await getWallGroupService({ userId, accountId });
	const levels = data.levels || [];
	const total = levels.reduce((sum, lvl) => sum + lvl.count, 0);
	const maxed = levels.filter(lvl => lvl.level >= data.maxLevel).reduce((sum, lvl) => sum + lvl.count, 0);
	return {
		total,
		maxed,
		totalAllowed: data.totalAllowed,
		maxLevel: data.maxLevel,
		byLevel: levels
	};
}
