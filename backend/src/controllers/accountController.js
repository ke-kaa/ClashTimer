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

