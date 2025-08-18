import Pet from '../models/Pet.js';
import Account from '../models/Account.js';
import Hero from '../models/Hero.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

function createError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
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

async function findOwnedPetById(userId, petId) {
    requireUserId(userId);
    if (!petId) {
        throw createError('petId is required', 400);
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }

    const accountOwned = await Account.exists({ _id: pet.account, owner: userId });
    if (!accountOwned) {
        throw createError('Forbidden', 403);
    }

    return pet;
}

function normalizePetInput(str = '') {
    return str.toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
}

export async function getPetsService(userId, accountId) {
    await assertAccountOwnership(userId, accountId);
    return Pet.find({ account: accountId });
}

export async function getPetByIdService(userId, petId) {
    return findOwnedPetById(userId, petId);
}

export async function unlockPetService(userId, accountId, { petType, petName, name } = {}) {
    const account = await assertAccountOwnership(userId, accountId, 'townHallLevel pets');

    const rawInput = petType || petName || name;
    if (!rawInput) {
        throw createError('petType or pet name required', 400);
    }

    const thLevel = account.townHallLevel;
    const thData = itemsByTownHall[thLevel];
    if (!thData || !Array.isArray(thData.pets)) {
        throw createError('No pets available at this Town Hall level', 400);
    }

    const normInput = normalizePetInput(rawInput);
    const petsAvailable = thData.pets;

    const matchedConfigEntry = petsAvailable.find(entry => normalizePetInput(entry.name) === normInput);
    if (!matchedConfigEntry) {
        const available = petsAvailable.map(p => p.name).filter(Boolean);
        const err = createError('Pet not available at this Town Hall level', 404);
        err.availablePets = available;
        throw err;
    }

    const petNameFromConfig = matchedConfigEntry.name;
    if (!petNameFromConfig) {
        throw createError('Pet configuration missing name value', 500);
    }

    const duplicate = await Pet.findOne({ account: accountId, petType: petNameFromConfig });
    if (duplicate) {
        const err = createError('Pet already unlocked for this account', 409);
        err.petType = petNameFromConfig;
        throw err;
    }

    const maxLevelFromConfig = matchedConfigEntry.maxLevel ?? 1;
    const petDoc = new Pet({
        name: petNameFromConfig,
        petType: petNameFromConfig,
        currentLevel: 0,
        maxLevel: maxLevelFromConfig,
        account: accountId
    });
    await petDoc.save();

    if (Array.isArray(account.pets)) {
        account.pets.push(petDoc._id);
        await account.save();
    } else {
        await Account.findByIdAndUpdate(accountId, { $addToSet: { pets: petDoc._id } });
    }

    return petDoc;
}

export async function assignPetToHeroService(userId, accountId, { petId, heroId } = {}) {
    if (!petId || !heroId) {
        throw createError('petId and heroId required', 400);
    }

    const account = await assertAccountOwnership(userId, accountId, 'heroes');
    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }
    if (pet.account.toString() !== account._id.toString()) {
        throw createError('Pet does not belong to this account', 403);
    }
    if (pet.status === 'Upgrading') {
        throw createError('Cannot assign while upgrading', 400);
    }
    if (pet.assignedHero) {
        throw createError('Pet already assigned', 409);
    }

    const hero = await Hero.findById(heroId);
    if (!hero) {
        throw createError('Hero not found', 404);
    }
    if (hero.account.toString() !== account._id.toString()) {
        throw createError('Hero does not belong to this account', 403);
    }

    pet.assignedHero = heroId;
    await pet.save();
    return pet;
}

export async function unassignPetService(userId, accountId, petId) {
    await assertAccountOwnership(userId, accountId);
    if (!petId) {
        throw createError('petId required', 400);
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }
    if (pet.account.toString() !== accountId.toString()) {
        throw createError('Pet does not belong to this account', 403);
    }
    if (!pet.assignedHero) {
        throw createError('Pet already unassigned', 409);
    }

    pet.assignedHero = null;
    await pet.save();
    return pet;
}

export async function startPetUpgradeService(userId, accountId, { petId, upgradeTimeSec, upgradeCost } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!petId) {
        throw createError('petId required', 400);
    }
    if (upgradeTimeSec === undefined || upgradeTimeSec === null) {
        throw createError('upgradeTimeSec required (seconds)', 400);
    }

    const timeNum = Number(upgradeTimeSec);
    if (!Number.isFinite(timeNum) || timeNum < 0) {
        throw createError('upgradeTimeSec must be a non-negative number', 400);
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }
    if (pet.account.toString() !== accountId.toString()) {
        throw createError('Pet does not belong to this account', 403);
    }
    if (pet.status === 'Upgrading') {
        throw createError('Pet already upgrading', 409);
    }
    if (pet.currentLevel >= pet.maxLevel) {
        throw createError('Pet already at max level', 400);
    }

    if (timeNum === 0) {
        pet.currentLevel = Math.min(pet.currentLevel + 1, pet.maxLevel);
        pet.status = 'Idle';
        pet.upgradeStartTime = null;
        pet.upgradeEndTime = null;
        pet.upgradeTime = 0;
        pet.upgradeCost = Number(upgradeCost) || 0;
        await pet.save();
        return { pet, instant: true };
    }

    const now = new Date();
    const end = new Date(now.getTime() + timeNum * 1000);
    pet.status = 'Upgrading';
    pet.upgradeStartTime = now;
    pet.upgradeEndTime = end;
    pet.upgradeCost = Number(upgradeCost) || 0;
    pet.upgradeTime = timeNum;
    await pet.save();
    return pet;
}

export async function getPetUpgradeStatusService(userId, petId) {
    const pet = await findOwnedPetById(userId, petId);
    if (pet.status !== 'Upgrading' || !pet.upgradeStartTime || !pet.upgradeEndTime) {
        return {
            petId: pet._id,
            status: pet.status,
            progress: pet.status === 'Idle' ? 100 : 0,
        };
    }

    const now = Date.now();
    const total = pet.upgradeEndTime.getTime() - pet.upgradeStartTime.getTime();
    const elapsed = Math.min(now - pet.upgradeStartTime.getTime(), total);
    const percent = total > 0 ? Math.round((elapsed / total) * 100) : 0;
    const remaining = Math.max(0, pet.upgradeEndTime.getTime() - now);

    return {
        petId: pet._id,
        status: now >= pet.upgradeEndTime.getTime() ? 'Finished (pending finalize)' : pet.status,
        progress: now >= pet.upgradeEndTime.getTime() ? 100 : percent,
        remainingSeconds: Math.max(0, Math.ceil(remaining / 1000)),
        endsAt: pet.upgradeEndTime,
    };
}

export async function finishPetUpgradeService(userId, accountId, { petId } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!petId) {
        throw createError('petId required', 400);
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }
    if (pet.account.toString() !== accountId.toString()) {
        throw createError('Pet does not belong to this account', 403);
    }
    if (pet.status !== 'Upgrading') {
        throw createError('Pet not upgrading', 400);
    }
    // if (!pet.upgradeEndTime || Date.now() < pet.upgradeEndTime.getTime()) {
    //     throw createError('Upgrade not yet complete', 400);
    // }

    pet.currentLevel += 1;
    pet.status = 'Idle';
    pet.upgradeStartTime = null;
    pet.upgradeEndTime = null;
    pet.upgradeCost = 0;
    pet.upgradeTime = 0;
    await pet.save();
    return pet;
}

export async function cancelPetUpgradeService(userId, accountId, { petId } = {}) {
    await assertAccountOwnership(userId, accountId);
    if (!petId) {
        throw createError('petId required', 400);
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
        throw createError('Pet not found', 404);
    }
    if (pet.account.toString() !== accountId.toString()) {
        throw createError('Pet does not belong to this account', 403);
    }
    if (pet.status !== 'Upgrading') {
        throw createError('Pet not upgrading', 400);
    }

    pet.status = 'Idle';
    pet.upgradeStartTime = null;
    pet.upgradeEndTime = null;
    pet.upgradeCost = 0;
    pet.upgradeTime = 0;
    await pet.save();
    return pet;
}
