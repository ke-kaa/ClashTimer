import Spell from '../models/Spell.js';
import Account from '../models/Account.js';
import { normalizeKey } from '../utils/convertUtils.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';
import { startUpgrade, finishUpgrade, canFinishUpgrade } from '../utils/upgradeUtils.js';
import { computeUpgradeStatus } from '../utils/computeUpgradeStatusUtils.js';

function createError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function requireUserId(userId) {
    if (!userId) {
        throw createError('Authentication required', 401);
    }
}

async function assertAccountOwnership(userId, accountId, projection) {
    requireUserId(userId);
    if (!accountId) {
        throw createError('accountId is required', 400);
    }

    const query = Account.findOne({ _id: accountId, owner: userId });
    if (projection) {
        query.select(projection);
    } else {
        query.select('_id');
    }

    const account = await query;
    if (!account) {
        throw createError('Account not found', 404);
    }
    return account;
}

async function findOwnedSpellById(userId, spellId) {
    requireUserId(userId);
    if (!spellId) {
        throw createError('spellId is required', 400);
    }

    const spell = await Spell.findById(spellId);
    if (!spell) {
        throw createError('Spell not found', 404);
    }

    const ownsAccount = await Account.exists({ _id: spell.account, owner: userId });
    if (!ownsAccount) {
        throw createError('Forbidden', 403);
    }

    return spell;
}

export async function createSpellService(userId, accountId, { name, spellName, currentLevel } = {}) {
    const account = await assertAccountOwnership(userId, accountId, 'townHallLevel spells');

    const inputName = name || spellName;
    if (!inputName) {
        throw createError('spell name is required', 400);
    }

    const thLevel = account.townHallLevel;
    const thConfig = itemsByTownHall?.[thLevel];
    if (!thConfig || !Array.isArray(thConfig.spells)) {
        throw createError(`No spell configuration for Town Hall ${thLevel}`, 400);
    }

    const targetKey = normalizeKey(inputName);
    const spellEntry = thConfig.spells.find(s => normalizeKey(s.spellName ?? s.name) === targetKey);
    if (!spellEntry) {
        const err = createError('Spell not available at this Town Hall', 404);
        err.availableSpells = thConfig.spells.map(s => s.spellName ?? s.name).filter(Boolean);
        throw err;
    }

    const canonicalName = spellEntry.spellName ?? spellEntry.name;
    const derivedMaxLevel = spellEntry.maxLevel ?? 1;
    const derivedType = spellEntry.type ?? 'Elixir';
    const derivedHousing = spellEntry.housingSpace ?? 1;

    const duplicate = await Spell.findOne({ account: accountId, name: canonicalName });
    if (duplicate) {
        throw createError('Spell already exists for this account', 409);
    }

    const lvl = currentLevel ?? 0;
    if (lvl < 0 || lvl > derivedMaxLevel) {
        throw createError(`currentLevel must be between 0 and ${derivedMaxLevel}`, 400);
    }

    const spell = new Spell({
        name: canonicalName,
        spellType: derivedType,
        currentLevel: lvl,
        maxLevel: derivedMaxLevel,
        housingSpace: derivedHousing,
        status: 'Idle',
        account: accountId
    });
    await spell.save();

    if (Array.isArray(account.spells)) {
        account.spells.push(spell._id);
        await account.save();
    } else {
        await Account.findByIdAndUpdate(accountId, { $addToSet: { spells: spell._id } });
    }

    return spell;
}

export async function getSpellsByAccountService(userId, accountId) {
    await assertAccountOwnership(userId, accountId);
    return Spell.find({ account: accountId }).sort({ createdAt: -1 });
}

export async function getSpellByIdService(userId, spellId) {
    return findOwnedSpellById(userId, spellId);
}

export async function deleteSpellService(userId, spellId) {
    const spell = await findOwnedSpellById(userId, spellId);
    await Account.findByIdAndUpdate(spell.account, { $pull: { spells: spell._id } });
    await spell.deleteOne();
    return { deleted: true, spellId: spell._id };
}

export async function startSpellUpgradeService(userId, accountId, { spellId, upgradeTimeSec, upgradeCost } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!spellId) {
        throw createError('spellId required', 400);
    }
    if (upgradeTimeSec === undefined || upgradeTimeSec === null) {
        throw createError('upgradeTimeSec required', 400);
    }

    const time = Number(upgradeTimeSec);
    if (!Number.isFinite(time) || time < 0) {
        throw createError('upgradeTimeSec must be a non-negative number', 400);
    }

    const spell = await findOwnedSpellById(userId, spellId);
    if (spell.account.toString() !== accountId.toString()) {
        throw createError('Spell does not belong to this account', 403);
    }
    if (spell.status === 'Upgrading') {
        throw createError('Spell already upgrading', 409);
    }
    if (spell.currentLevel >= spell.maxLevel) {
        throw createError('Spell already at max level', 400);
    }

    if (time === 0) {
        spell.currentLevel = Math.min(spell.currentLevel + 1, spell.maxLevel);
        spell.status = 'Idle';
        spell.upgradeStartTime = null;
        spell.upgradeEndTime = null;
        spell.upgradeTime = 0;
        spell.upgradeCost = Number(upgradeCost) || 0;
        await spell.save();
        return { spell, instant: true };
    }

    const now = new Date();
    spell.status = 'Upgrading';
    spell.upgradeStartTime = now;
    spell.upgradeEndTime = new Date(now.getTime() + time * 1000);
    spell.upgradeTime = time;
    spell.upgradeCost = Number(upgradeCost) || 0;
    await spell.save();
    return spell;
}

export async function finishSpellUpgradeService(userId, accountId, { spellId } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!spellId) {
        throw createError('spellId required', 400);
    }

    const spell = await findOwnedSpellById(userId, spellId);
    if (spell.account.toString() !== accountId.toString()) {
        throw createError('Spell does not belong to this account', 403);
    }
    if (spell.status !== 'Upgrading') {
        throw createError('Spell not upgrading', 400);
    }
    // if (!canFinishUpgrade(spell)) {
    //     throw createError('No active upgrade or upgrade not finished yet', 400);
    // }

    finishUpgrade(spell);
    await spell.save();
    return spell;
}

export async function cancelSpellUpgradeService(userId, accountId, { spellId } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!spellId) {
        throw createError('spellId required', 400);
    }

    const spell = await findOwnedSpellById(userId, spellId);
    if (spell.account.toString() !== accountId.toString()) {
        throw createError('Spell does not belong to this account', 403);
    }
    if (spell.status !== 'Upgrading') {
        throw createError('Spell not upgrading', 400);
    }

    spell.status = 'Idle';
    spell.upgradeStartTime = null;
    spell.upgradeEndTime = null;
    spell.upgradeTime = 0;
    spell.upgradeCost = 0;
    await spell.save();
    return spell;
}

export async function getSpellUpgradeStatusService(userId, spellId) {
    const spell = await findOwnedSpellById(userId, spellId);
    return computeUpgradeStatus(spell);
}
