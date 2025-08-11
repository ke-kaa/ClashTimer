import Troop from '../models/Troop.js';
import { isId } from '../utils/validationUtils.js';
import { normalizeKey } from '../utils/convertUtils.js'
import Account from '../models/Account.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';
import { startUpgrade, finishUpgrade, canFinishUpgrade } from '../utils/upgradeUtils.js';
import { computeUpgradeStatus } from '../utils/computeUpgradeStatusUtils.js';

export async function createTroopService({ accountId, name, troopName, currentLevel }) {
    if (!isId(accountId)) throw { status: 400, message: 'Invalid accountId' };

    const inputName = name || troopName;
    if (!inputName) throw { status: 400, message: 'troop name is required' };

    // Load account to read TH level
    const account = await Account.findById(accountId);
    if (!account) throw { status: 404, message: 'Account not found' };

    const th = account.townHallLevel;
    const thConfig = itemsByTownHall?.[th];
    if (!thConfig || !Array.isArray(thConfig.troops)) {
        throw { status: 400, message: `No troop configuration for Town Hall ${th}` };
    }

    // Find the troop in TH config
    const targetKey = normalizeKey(inputName);
    const troopEntry = thConfig.troops.find(s => normalizeKey(s.troopName) === targetKey);

    if (!troopEntry) {
        throw {
        status: 404,
        message: 'troop not available at this Town Hall',
        availabletroops: thConfig.troops.map(s => s.troopName)
        };
    }

    const canonicalName = troopEntry.troopName;
    const derivedMaxLevel = troopEntry.maxLevel ?? 1;
    const derivedType = troopEntry.type ?? 'Elixir';
    if (!derivedType) {
        throw { status: 500, message: `Missing troopType mapping for ${canonicalName}` };
    }
    const derivedHousing = troopEntry.housingSpace ?? 1;

    // Duplicate check by canonical name for this account
    const existing = await Troop.findOne({ account: accountId, name: canonicalName });
    if (existing) throw { status: 409, message: 'troop already exists for this account' };

    // Validate/derive current level
    const lvl = currentLevel ?? 0;
    if (lvl < 0 || lvl > derivedMaxLevel) {
        throw { status: 400, message: `currentLevel must be between 0 and ${derivedMaxLevel}` };
    }

    const troop = await Troop.create({
        name: canonicalName,
        troopType: derivedType,
        currentLevel: lvl,
        maxLevel: derivedMaxLevel,
        housingSpace: derivedHousing,
        status: 'Idle',
        account: accountId
    });

    account.troops.push(troop.id);
    await account.save();


    return troop;
}

export async function getTroopsByAccountService({ accountId }) {
    return await Troop.find({ accoun: accountId }).sort({ createdAt: -1 });
}

export async function getTroopByIdService(id) {
    if (!isId(id)) {
        throw { status: 400, message: 'Invalid troop id' };
    }

    const troop = await Troop.findById(id).populate('account');
    if (!troop) {
        throw { status: 404, message: 'troop not found' };
    }

    return troop;
}

export async function deleteTroopService(id) {
    if (!isId(id)) {
        throw { status: 400, message: 'Invalid troop id' };
    }

    const troop = await Troop.findByIdAndDelete(id);
    if (!troop) {
        throw { status: 404, message: 'troop not found' };
    }

    return troop; 
}

export async function startTroopUpgradeService(troopId, upgradeTimeSec, upgradeCost) {
    const troop = await Troop.findById(troopId);
    if (!troop) throw new Error('troop not found');

    return await startUpgrade(troop, upgradeTimeSec, upgradeCost);
}

export async function finishTroopUpgradeService(troopId) {
    const troop = await Troop.findById(troopId);
    if (!troop) {
        throw { status: 404, message: 'troop not found' };
    }

    if (!canFinishUpgrade(troop)) {
        throw { status: 400, message: 'No active upgrade or upgrade not finished yet' };
    }

    const updatedtroop = finishUpgrade(troop);
    await updatedtroop.save();
    return updatedtroop;
}

export function getTroopUpgradeStatusService(troop) {
    return computeUpgradeStatus(troop);
}
