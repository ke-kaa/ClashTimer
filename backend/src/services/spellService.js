import Spell from '../models/Spell.js';
import { isId } from '../utils/validationUtils.js';
import { normalizeKey } from '../utils/convertUtils.js'
import Account from '../models/Account.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

export async function createSpellService({ accountId, name, spellName, currentLevel }) {
    if (!isId(accountId)) throw { status: 400, message: 'Invalid accountId' };

    const inputName = name || spellName;
    if (!inputName) throw { status: 400, message: 'spell name is required' };

    // Load account to read TH level
    const account = await Account.findById(accountId);
    if (!account) throw { status: 404, message: 'Account not found' };

    const th = account.townHallLevel;
    const thConfig = itemsByTownHall?.[th];
    if (!thConfig || !Array.isArray(thConfig.spells)) {
        throw { status: 400, message: `No spell configuration for Town Hall ${th}` };
    }

    // Find the spell in TH config
    const targetKey = normalizeKey(inputName);
    const spellEntry = thConfig.spells.find(s => normalizeKey(s.spellName) === targetKey);

    if (!spellEntry) {
        throw {
        status: 404,
        message: 'Spell not available at this Town Hall',
        availableSpells: thConfig.spells.map(s => s.spellName)
        };
    }

    const canonicalName = spellEntry.spellName;
    const derivedMaxLevel = spellEntry.maxLevel ?? 1;
    const derivedType = spellEntry.type ?? 'Elixir';
    if (!derivedType) {
        throw { status: 500, message: `Missing spellType mapping for ${canonicalName}` };
    }
    const derivedHousing = spellEntry.housingSpace ?? 1;

    // Duplicate check by canonical name for this account
    const existing = await Spell.findOne({ account: accountId, name: canonicalName });
    if (existing) throw { status: 409, message: 'Spell already exists for this account' };

    // Validate/derive current level
    const lvl = currentLevel ?? 0;
    if (lvl < 0 || lvl > derivedMaxLevel) {
        throw { status: 400, message: `currentLevel must be between 0 and ${derivedMaxLevel}` };
    }

    const spell = await Spell.create({
        name: canonicalName,
        spellType: derivedType,
        currentLevel: lvl,
        maxLevel: derivedMaxLevel,
        housingSpace: derivedHousing,
        status: 'Idle',
        account: accountId
    });

    account.spells.push(spell.id);
    await account.save();


    return spell;
}

export async function getSpellsByAccountService({ accountId }) {
    return await Spell.find({ accoun: accountId }).sort({ createdAt: -1 });
}

export async function getSpellByIdService(id) {
    if (!isId(id)) {
        throw { status: 400, message: 'Invalid spell id' };
    }

    const spell = await Spell.findById(id).populate('account');
    if (!spell) {
        throw { status: 404, message: 'Spell not found' };
    }

    return spell;
}

export async function deleteSpellService(id) {
    if (!isId(id)) {
        throw { status: 400, message: 'Invalid spell id' };
    }

    const spell = await Spell.findByIdAndDelete(id);
    if (!spell) {
        throw { status: 404, message: 'Spell not found' };
    }

    return spell; 
}
