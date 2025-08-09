import Account from "../../models/Account";
import { itemsByTownHall, maxTownHallLevel } from "../../utils/itemsByTownHall";  
import Building from "../../models/Building";
import Hero from "../../models/Hero";
import Pet from "../../models/Pet";
import Siege from "../../models/Siege";
import Spell from "../../models/Spell";
import Troop from "../../models/Troop";


export async function getAccountsService({ clanTag, townHallLevel, playerTag, sortBy }) {
    let query = {};

    // Filter by clan tag if provided
    if (clanTag) {
        query.clanTag = clanTag;
    }
    // Filter by town hall level if provided
    if (townHallLevel) {
        query.townHallLevel = parseInt(townHallLevel);
    }
    // Filter by player tag if provided
    if (playerTag) {
        query.playerTag = playerTag;
    }

    let accounts = await Account.find(query);

    if (sortBy) {
            switch (sortBy) {
                case 'username':
                    accounts.sort((a, b) => a.username.localeCompare(b.username));
                    break;
                case 'townHallLevel':
                    accounts.sort((a, b) => b.townHallLevel - a.townHallLevel);
                    break;
                case 'lastActive':
                    accounts.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                    break;
                case 'totalUpgrades':
                    accounts.sort((a, b) => b.totalUpgrades - a.totalUpgrades);
                    break;
                default:
                    break;
            }
    }

    return accounts;
}

export async function getAccountDetailService(accountId){
    const account = await Account.findById(accountId)
        .populate('buildings')
        .populate('heroes')
        .populate('pets')
        .populate('siege')
        .populate('spells')
        .populate('troops')
        .populate('research')
        .populate('upgrades');
    
    if (!account) throw { status: 404, message: 'Account not found' };

    account.lastActive = new Date();
    await account.save();

    return account;
}

export async function createAccountService({ username, playerTag, townHallLevel, clanTag, preferences }) {
    if (playerTag) {
        const existingAccount = await Account.findOne({ playerTag });
        if (existingAccount) {
            const err = new Error('Player tag already exists.');
            err.status = 404;
            throw err;
        }
    }
    const thData = itemsByTownHall[townHallLevel];

    const account = new Account({
                username,
                playerTag: playerTag || null,
                townHallLevel,
                clanTag: clanTag || null,
                lastActive: new Date(),
                totalUpgrades: 0,
                preferences: {
                    notifications: preferences?.notifications ?? true,
                    theme: preferences?.theme ?? 'light',
                    language: preferences?.language ?? 'en'
                }
    });

    let buildingIds = [], heroIds = [], troopIds = [], petIds = [], siegeIds = [], spellIds = [];

    for (const b of thData.buildingIds) {
        for (let i = 0; i < b.count; i++){
            const building = new Building({
            name: b.itemName,
            buildingType: b.buildingType || 'Special', // Default to 'Special' if not specified
            currentLevel: 0,
            maxLevel: b.maxLevel,
            status: 'Idle',
            account: account._id
        });
            await building.save();
            buildingIds.push(building._id)
        }
    }
    
    for (const h of thData.heroes) {
        const hero = new Hero({
            name: h.heroName,
            heroType: h.heroType || h.heroName, // Use heroName as heroType if not specified
            currentLevel: 0,
            maxLevel: h.maxLevel,
            status: 'Idle',
            account: account._id
        });
            await hero.save();
            heroIds.push(hero._id);
    }
    
    for (const p of thData.pets) {
        const pet = new Pet({
            name: p.petName,
            petType: p.petType || p.petName, // Use petName as petType if not specified
            currentLevel: 0,
            maxLevel: p.maxLevel,
            status: 'Idle',
            account: account._id
        });
            await pet.save();
            petIds.push(pet._id);
    }
    
    for (const s of thData.sieges) {
        const siege = new Siege({
                name: s.siegeName,
                siegeType: s.siegeType || s.siegeName, // Use siegeName as siegeType if not specified
                currentLevel: 0,
                maxLevel: s.maxLevel,
                status: 'Idle',
                account: account._id
            });
        await siege.save();
        siegeIds.push(siege._id);
    }
    
    for (const s of thData.spells) {
        const spell = new Spell({
                name: s.spellName,
                spellType: s.spellType || 'Elixir', // Default to 'Elixir' if not specified
                currentLevel: 0,
                maxLevel: s.maxLevel,
                status: 'Idle',
                account: account._id
            });
        await spell.save();
        spellIds.push(spell._id);
    }
    
    for (const t of thData.troops) {
        const troop = new Troop({
                name: t.troopName,
                troopType: t.troopType || 'Elixir', // Default to 'Elixir' if not specified
                currentLevel: 0,
                maxLevel: t.maxLevel,
                status: 'Idle',
                account: account._id
            });
            await troop.save();
            troopIds.push(troop._id);
    }
    
    account.buildings = buildingIds;
    account.heroes = heroIds;
    account.pets = petIds;
    account.siege = siegeIds;
    account.spells = spellIds;
    account.troops = troopIds;
    
    await account.save();

    return account;

}

export async function updateAccountService({id, username, playerTag, townHallLevel, clanTag, preferences }) {
    const account = await Account.findById(id);

    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }
    
    if (username) {
        account.username = username;
    } 

    if (playerTag !== undefined) {
        // Check if playerTag already exists (if provided and different from current)
        if (playerTag && playerTag !== account.playerTag) {
            const existingAccount = await Account.findOne({ playerTag });
            if (existingAccount) {
                const err = new Error('Player tag already exists');
                err.status = 400;
                throw err;
            }
        }
            account.playerTag = playerTag;
    }

    if (townHallLevel !== undefined) {
        if (!Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > maxTownHallLevel) {
            const err = new Error('Invalid town hall level');
            err.status = 400;
            throw err;
        }
        if (townHallLevel !== account.townHallLevel) {
            const err = new Error('Changing Town Hall level is not supported yet.');
            err.status = 400;
            throw err;
        }
    }

    if (clanTag !== undefined) {
        account.clanTag = clanTag;
    }

    if (preferences) {
        account.preferences = {
            ...account.preferences,
            ...preferences
        };
    }

    account.lastActive = new Date();
    await account.save();
}

export async function deleteAccountService(accountId) {
    const account = await Account.findById(accountId);

    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }

    const [ buildingRes,heroRes, petRes, siegeRes, spellRes, troopRes, researchRes, upgradeRes ] = await Promise.all([
        Building.deleteMany({ account: accountId }),
        Hero.deleteMany({ account: accountId }),
        Pet.deleteMany({ account: accountId }),
        Siege.deleteMany({ account: accountId }),
        Spell.deleteMany({ account: accountId }),
        Troop.deleteMany({ account: accountId }),
        Research.deleteMany({ account: accountId }),
        Upgrade.deleteMany({ account: accountId })
    ]);

    await Account.findByIdAndDelete(accountId);

    return {
        deleted: true,
        accountId,
        removed: {
            buildings: buildingRes.deletedCount || 0,
            heroes: heroRes.deletedCount || 0,
            pets: petRes.deletedCount || 0,
            sieges: siegeRes.deletedCount || 0,
            spells: spellRes.deletedCount || 0,
            troops: troopRes.deletedCount || 0,
            research: researchRes.deletedCount || 0,
            upgrades: upgradeRes.deletedCount || 0
        }
    };
}

export async function getAccountStatsService(accountId) {
    const account = await Account.findById(accountId);
    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }

    const [ buildingStats, heroStats, troopStats, petStats, siegeStats, spellStats ] = await Promise.all([
        Building.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Hero.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Troop.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Pet.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Siege.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Spell.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ])
    ]);

    return {
        account: {
            username: account.username,
            townHallLevel: account.townHallLevel,
            clanTag: account.clanTag,
            lastActive: account.lastActive,
            totalUpgrades: account.totalUpgrades,
            preferences: account.preferences
        },
        buildings: buildingStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        heroes: heroStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        troops: troopStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        pets: petStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        sieges: siegeStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        spells: spellStats[0] || { total: 0, maxed: 0, upgrading: 0 }
    };
}

export async function getAccountsByClanService({ clanTag, sortBy }) {
    if (!clanTag) throw { status: 400, message: 'clanTag is required' };

    let accounts = await Account.find({ clanTag });

    if (sortBy) {
        switch (sortBy) {
            case 'username':
                accounts.sort((a, b) => a.username.localeCompare(b.username));
                break;
            case 'townHallLevel':
                accounts.sort((a, b) => b.townHallLevel - a.townHallLevel);
                break;
            case 'lastActive':
                accounts.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                break;
            case 'totalUpgrades':
                accounts.sort((a, b) => b.totalUpgrades - a.totalUpgrades);
                break;
            default:
                break;
        }
    }
    return accounts;
}

export async function updateAccountPreferencesService({ accountId, preferences }) {
    if (!preferences || typeof preferences !== 'object') {
        throw { status: 400, message: 'preferences object is required' };
    }

    const account = await Account.findById(accountId);
    if (!account) throw { status: 404, message: 'Account not found' };

    account.preferences = {
        ...account.preferences,
        ...preferences
    };
    account.lastActive = new Date();
    await account.save();

    return account.preferences;
}

export async function getAccountByPlayerTagService(playerTag) {
    if (!playerTag) throw { status: 400, message: 'playerTag is required' };

    const account = await Account.findOne({ playerTag })
        .populate('buildings')
        .populate('heroes')
        .populate('pets')
        .populate('siege')
        .populate('spells')
        .populate('troops')
        .populate('research')
        .populate('upgrades');

    if (!account) throw { status: 404, message: 'Account not found' };

    account.lastActive = new Date();
    await account.save();

    return account;
}

export async function searchAccountsService({ q, type, limit = 20 }) {
    if (!q) throw { status: 400, message: 'Search query is required' };

    const regex = { $regex: q, $options: 'i' };
    let query = {};

    if (type === 'playerTag') {
        query.playerTag = regex;
    } else if (type === 'username') {
        query.username = regex;
    } else {
        query.$or = [
            { username: regex },
            { playerTag: regex }
        ];
    }

    const accounts = await Account.find(query)
        .select('username playerTag townHallLevel clanTag lastActive totalUpgrades')
        .limit(limit);

    return accounts;
}
