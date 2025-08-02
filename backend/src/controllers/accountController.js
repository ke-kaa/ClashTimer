import Account from '../models/Account.js';
import Building from '../models/Building.js';
import Hero from '../models/Hero.js';
import Pet from '../models/Pet.js';
import Siege from '../models/Siege.js';
import Spell from '../models/Spell.js';
import Troop from '../models/Troop.js';
import Research from '../models/Research.js';
import Upgrade from '../models/Upgrade.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

export async function getAccounts(req, res) {
    try {
        const { clanTag, townHallLevel, playerTag, sortBy } = req.query;
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

        // Sort accounts if requested
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

        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountDetail(req, res) {
    try {
        const account = await Account.findById(req.params.id)
            .populate('buildings')
            .populate('heroes')
            .populate('pets')
            .populate('siege')
            .populate('spells')
            .populate('troops')
            .populate('research')
            .populate('upgrades');
        
        if (!account) return res.status(404).json({ error: 'Account not found' });
        
        // Update lastActive timestamp
        account.lastActive = new Date();
        await account.save();
        
        return res.json(account);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function createAccount(req, res) {
    try {
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        if (!username || !Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > 17) {
            return res.status(400).json({ error: 'Invalid username or town hall level.'});
        }

        // Check if playerTag already exists (if provided)
        if (playerTag) {
            const existingAccount = await Account.findOne({ playerTag });
            if (existingAccount) {
                return res.status(400).json({ error: 'Player tag already exists' });
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
                    icon: b.icon, // the thData file does not contain any link to an icon so set it here after adding icons to an asset folder.
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
                icon: h.icon,
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
                icon: p.icon,
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
                icon: s.icon,
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
                icon: s.icon,
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
                icon: t.icon,
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
        account.sieges = siegeIds;
        account.spells = spellIds;
        account.troops = troopIds;
        
        await account.save();

        return res.status(201).json(account);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function updateAccount(req, res) {
    try {
        const { id } = req.params;
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (username) {
            account.username = username;
        }

        if (playerTag !== undefined) {
            // Check if playerTag already exists (if provided and different from current)
            if (playerTag && playerTag !== account.playerTag) {
                const existingAccount = await Account.findOne({ playerTag });
                if (existingAccount) {
                    return res.status(400).json({ error: 'Player tag already exists' });
                }
            }
            account.playerTag = playerTag;
        }

        if (townHallLevel !== undefined) {
            if (!Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > 17) {
                return res.status(400).json({ error: 'Invalid town hall level' });
            }
            if (townHallLevel !== account.townHallLevel) {
                return res.status(400).json({ error: 'Changing Town Hall level is not supported yet.' });
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

        return res.json(account);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteAccount(req, res) {
    try {
        const { id } = req.params;
        
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Delete all associated data
        await Building.deleteMany({ account: id });
        await Hero.deleteMany({ account: id });
        await Pet.deleteMany({ account: id });
        await Siege.deleteMany({ account: id });
        await Spell.deleteMany({ account: id });
        await Troop.deleteMany({ account: id });
        await Research.deleteMany({ account: id });
        await Upgrade.deleteMany({ account: id });

        await Account.findByIdAndDelete(id);

        return res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountStats(req, res) {
    try {
        const { id } = req.params;
        
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Get building statistics
        const buildingStats = await Building.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]);

        // Get hero statistics
        const heroStats = await Hero.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]);

        // Get troop statistics
        const troopStats = await Troop.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]);

        return res.json({
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
            troops: troopStats[0] || { total: 0, maxed: 0, upgrading: 0 }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountsByClan(req, res) {
    try {
        const { clanTag } = req.params;
        const { sortBy } = req.query;

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

        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}