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
import { getAccountsService, getAccountDetailService, createAccountService, updateAccountService, deleteAccountService, getAccountStatsService, getAccountsByClanService, updateAccountPreferencesService, getAccountByPlayerTagService, searchAccountsService } from '../services/accountService.js'

export async function getAccounts(req, res) {
    try {
        const { clanTag, townHallLevel, playerTag, sortBy } = req.query;
        let accounts = await getAccountsService({ clanTag, townHallLevel, playerTag, sortBy });
        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountDetail(req, res) {
    try {
        let account = await getAccountDetailService(req.params.id);
        
        return res.json(account);
    } catch (error) {
        if (error.status === 404 ){
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

export async function createAccount(req, res) {
    try {
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        if (!username || !Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > 17) {
            return res.status(400).json({ error: 'Invalid username or town hall level.'});
        }

        let account = await createAccountService({ username, playerTag, townHallLevel, clanTag, preferences })

        return res.status(201).json(account);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function updateAccount(req, res) {
    try {
        const { id } = req.params;
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        let account = await updateAccountService({ id, username, playerTag, townHallLevel, clanTag, preferences});

        return res.json(account);
    } catch (error) {
        if (error.message === 'Account not found') return res.status(404).json({ error: error.message });
        if (error.message === 'Player tag already exists') return res.status(400).json({ error: error.message });
        if (error.message === 'Invalid town hall level') return res.status(400).json({ error: error.message });
        if (error.message === 'Changing Town Hall level is not supported yet.') return res.status(400).json({ error: error.message });
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteAccount(req, res) {
    try {
        const { id } = req.params;
        
        const result = await deleteAccountService(id);

        return res.json({ message: 'Account deleted successfully', ...result });
    } catch (error) {
        if (error.status === 404 || error.message === 'Account not found') {
            return res.status(404).json({ error: 'Account not found' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function getAccountStats(req, res) {
    try {
        const { id } = req.params;
        const stats = await getAccountStatsService(id);
        return res.json(stats);
    } catch (error) {
        if (error.status === 404 || error.message === 'Account not found') {
            return res.status(404).json({ error: 'Account not found' });
        }
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountsByClan(req, res) {
    try {
        const { clanTag } = req.params;
        const { sortBy } = req.query;
        const accounts = await getAccountsByClanService({ clanTag, sortBy });
        return res.json(accounts);
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

export async function updateAccountPreferences(req, res) {
    try {
        const { id } = req.params;
        const { preferences } = req.body;
        const updated = await updateAccountPreferencesService({ accountId: id, preferences });
        return res.json(updated);
    } catch (error) {
        if (error.status === 404) return res.status(404).json({ error: 'Account not found' });
        if (error.status === 400) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountByPlayerTag(req, res) {
    try {
        const { playerTag } = req.params;
        const account = await getAccountByPlayerTagService(playerTag);
        return res.json(account);
    } catch (error) {
        if (error.status === 404) return res.status(404).json({ error: 'Account not found' });
        if (error.status === 400) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
}

export async function searchAccounts(req, res) {
    try {
        const { q, type, limit } = req.query;
        const accounts = await searchAccountsService({ q, type, limit: limit ? parseInt(limit) : 20 });
        return res.json(accounts);
    } catch (error) {
        if (error.status === 400) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
}
