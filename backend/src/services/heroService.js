import Hero from '../models/Hero.js';
import Account from '../models/Account.js';

function requireUserId(userId) {
    if (!userId) {
        const err = new Error('Authentication required');
        err.status = 401;
        throw err;
    }
}

async function assertAccountOwnership(userId, accountId) {
    requireUserId(userId);
    const owned = await Account.findOne({ _id: accountId, owner: userId }).select('_id');
    if (!owned) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }
}

async function ensureHeroOwnership(hero, userId) {
    requireUserId(userId);
    if (!hero || !hero.account) {
        const err = new Error('Hero does not reference an account');
        err.status = 500;
        throw err;
    }

    const account = hero.account;
    if (account?.owner) {
        const ownerId = typeof account.owner === 'object' && account.owner._id ? account.owner._id : account.owner;
        if (!ownerId || ownerId.toString() !== userId.toString()) {
            const err = new Error('Forbidden');
            err.status = 403;
            throw err;
        }
        return;
    }

    await assertAccountOwnership(userId, account);
}

async function findOwnedHeroById(id, userId, { populateAccount = false, accountFields = 'username townHallLevel' } = {}) {
    requireUserId(userId);
    const query = Hero.findById(id);
    if (populateAccount) {
        const fields = ['owner', accountFields].filter(Boolean).join(' ');
        query.populate('account', fields.trim());
    }

    const hero = await query;
    if (!hero) {
        const err = new Error('Hero not found');
        err.status = 404;
        throw err;
    }

    await ensureHeroOwnership(hero, userId);
    return hero;
}

export async function getAllHeroesService(userId, { accountId, status, heroType, name }) {
    const query = {};
    if (accountId) {
        await assertAccountOwnership(userId, accountId);
        query.account = accountId;
    }
    if (status && ['Idle', 'Upgrading'].includes(status)) query.status = status;
    if (heroType) query.heroType = heroType;
    if (name) query.name = { $regex: name, $options: 'i' };
    return Hero.find(query).populate('account', 'username townHallLevel');
}

export async function getHeroesByAccountService(userId, accountId) {
    await assertAccountOwnership(userId, accountId);
    return Hero.find({ account: accountId }).populate('account', 'username townHallLevel');
}

export async function getHeroByIdService(id, userId) {
    return findOwnedHeroById(id, userId, { populateAccount: true });
}

export async function updateHeroLevelService(id, currentLevel, userId) {
    if (currentLevel === undefined || !Number.isInteger(currentLevel) || currentLevel < 0) {
        const err = new Error('Invalid current level');
        err.status = 400;
        throw err;
    }
    const hero = await findOwnedHeroById(id, userId);
    if (currentLevel > hero.maxLevel) {
        const err = new Error('Current level cannot exceed max level');
        err.status = 400;
        throw err;
    }
    hero.currentLevel = currentLevel;
    await hero.save();
    return hero;
}

export async function startHeroUpgradeService(id, { upgradeCost, upgradeTime }, userId) {
    const hero = await findOwnedHeroById(id, userId);
    if (hero.status === 'Upgrading') {
        const err = new Error('Hero is already upgrading');
        err.status = 400;
        throw err;
    }
    if (hero.currentLevel >= hero.maxLevel) {
        const err = new Error('Hero is already at maximum level');
        err.status = 400;
        throw err;
    }

    const now = new Date();
    const end = new Date(now.getTime() + (upgradeTime || 0) * 1000);
    hero.status = 'Upgrading';
    hero.upgradeStartTime = now;
    hero.upgradeEndTime = end;
    hero.upgradeCost = upgradeCost || 0;
    hero.upgradeTime = upgradeTime || 0;
    await hero.save();
    return hero;
}

export async function completeHeroUpgradeService(id, userId) {
    const hero = await findOwnedHeroById(id, userId);
    if (hero.status !== 'Upgrading') {
        const err = new Error('Hero is not currently upgrading');
        err.status = 400;
        throw err;
    }
    if (hero.currentLevel >= hero.maxLevel) {
        const err = new Error('Hero is already at maximum level');
        err.status = 400;
        throw err;
    }

    hero.currentLevel += 1;
    hero.status = 'Idle';
    hero.upgradeStartTime = null;
    hero.upgradeEndTime = null;
    hero.upgradeCost = 0;
    hero.upgradeTime = 0;
    await hero.save();

    await Account.findByIdAndUpdate(hero.account, { $inc: { totalUpgrades: 1 } });
    return hero;
}

export async function cancelHeroUpgradeService(id, userId) {
    const hero = await findOwnedHeroById(id, userId);
    if (hero.status !== 'Upgrading') {
        const err = new Error('Hero is not currently upgrading');
        err.status = 400;
        throw err;
    }

    hero.status = 'Idle';
    hero.upgradeStartTime = null;
    hero.upgradeEndTime = null;
    await hero.save();
    return hero;
}

export async function getHeroesByStatusService(status, accountId, userId) {
    if (!['Idle', 'Upgrading'].includes(status)) {
        const err = new Error('Invalid status');
        err.status = 400;
        throw err;
    }
    const query = { status };
    if (accountId) {
        await assertAccountOwnership(userId, accountId);
        query.account = accountId;
    }
    return Hero.find(query).populate('account', 'username townHallLevel');
}

export async function getHeroUpgradeProgressService(id, userId) {
    const hero = await findOwnedHeroById(id, userId);
    if (hero.status !== 'Upgrading') {
        const err = new Error('Hero is not currently upgrading');
        err.status = 400;
        throw err;
    }

    const now = new Date();
    const totalMs = (hero.upgradeTime || 0) * 1000;
    const elapsed = now.getTime() - (hero.upgradeStartTime?.getTime() || now.getTime());
    const progress = totalMs > 0 ? Math.min(100, Math.max(0, (elapsed / totalMs) * 100)) : 0;
    const remaining = Math.max(0, (hero.upgradeEndTime?.getTime() || now.getTime()) - now.getTime());

    return {
        hero,
        progress: Math.round(progress),
        timeRemaining: Math.round(remaining / 1000),
        isReady: remaining <= 0
    };
}

export async function validateHeroUpgradeService(id, userId) {
    const hero = await findOwnedHeroById(id, userId);
    const canUpgrade = hero.status === 'Idle' && hero.currentLevel < hero.maxLevel;
    return {
        canUpgrade,
        currentLevel: hero.currentLevel,
        maxLevel: hero.maxLevel,
        status: hero.status
    };
}

export async function getTopHeroesService(accountId, userId) {
    await assertAccountOwnership(userId, accountId);
    return Hero.find({ account: accountId }).sort({ currentLevel: -1, name: 1 });
}