import { addVillageDetailService, getVillageService, getAccountsForDashboardService, getAccountsService, getAccountDetailService, createAccountService, updateAccountService, deleteAccountService, getAccountStatsService, getAccountsByClanService, updateAccountPreferencesService, getAccountByPlayerTagService, searchAccountsService } from '../services/accountService.js'


export async function getVillageController(req, res) {
    try {
        const { playerTag } = req.params;
        const playerData = await getVillageService(playerTag)
        
        return res.json(playerData);
    } catch (error) {
        return res.status(500).json({
            error: error.message || 'Coud not fetch player data.'
        })
    }
}

export async function getAccounts(req, res) {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ error: 'Authentication required' });
        const { clanTag, townHallLevel, playerTag, sortBy } = req.query;
        let accounts = await getAccountsService({ userId, clanTag, townHallLevel, playerTag, sortBy });
        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function addVillageDetailController(req, res) {
    try {
        const userId = req.user?.id || req.user?._id;
        const { cacheKey } = req.body;
        console.log(cacheKey)
        if (!userId) return res.status(401).json({ error: 'Authentication required' });

        let account = await addVillageDetailService({ userId, cacheKey });

        return res.status(201).json(account);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }
}

export async function getAccountsForDashboardController(req, res){
    try {
        const userId = req.user.id;
        const accounts = await getAccountsForDashboardService(userId);
        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getAccountDetail(req, res) {
    try {
        const userId = req.user?.id || req.user?._id;
        let account = await getAccountDetailService(userId, req.params.id);
        
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
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ error: 'Authentication required' });
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        if (!username || !Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > 17) {
            return res.status(400).json({ error: 'Invalid username or town hall level.'});
        }

    let account = await createAccountService({ userId, username, playerTag, townHallLevel, clanTag, preferences })

        return res.status(201).json(account);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function updateAccount(req, res) {
    try {
        const userId = req.user?.id || req.user?._id;
        const { id } = req.params;
        const { username, playerTag, townHallLevel, clanTag, preferences } = req.body;

        let account = await updateAccountService({ userId, id, username, playerTag, townHallLevel, clanTag, preferences});

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
        const userId = req.user?.id || req.user?._id;
        const result = await deleteAccountService(userId, id);

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
        const userId = req.user?.id || req.user?._id;
        const stats = await getAccountStatsService(userId, id);
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
        const userId = req.user?.id || req.user?._id;
        const { clanTag } = req.params;
        const { sortBy } = req.query;
        const accounts = await getAccountsByClanService({ userId, clanTag, sortBy });
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
        const userId = req.user?.id || req.user?._id;
        const updated = await updateAccountPreferencesService({ userId, accountId: id, preferences });
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
        const userId = req.user?.id || req.user?._id;
        const account = await getAccountByPlayerTagService(userId, playerTag);
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
        const userId = req.user?.id || req.user?._id;
        const accounts = await searchAccountsService({ userId, q, type, limit: limit ? parseInt(limit) : 20 });
        return res.json(accounts);
    } catch (error) {
        if (error.status === 400) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: error.message });
    }
}
