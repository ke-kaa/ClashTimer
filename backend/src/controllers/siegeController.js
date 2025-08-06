import Siege from '../models/Siege.js';
import Account from '../models/Account.js';
import { unlockSiegeService } from '../services/siegeService.js';

export async function getSiegesByAccountId(req, res) {
    try {
        const accountId = req.params.accountId || req.query.accountId;
        
        if (!accountId) {
            return res.status(400).json({ error: 'accountId required' })
        ;}

        const sieges = await Siege.find({ account: accountId }).sort({ createdAt: 1 });
        return res.json(sieges);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export async function getSiegeById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid siege id format' });
        }

        const siege = await Siege.findById(id);
        if (!siege) {
            return res.status(404).json({ error: 'Siege not found' });
        }

        return res.json(siege);
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function unlockSiege(req, res) {
    try {
        const { accountId, siegeType, name } = req.body;
        const input = siegeType || name; // frontend sends one identifier

        if (!accountId || !input) {
            return res.status(400).json({ error: 'accountId and siegeType (or name) required' });
        }

        const siege = await unlockSiegeService({ accountId, input })
        return res.status(201).json(siege);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}