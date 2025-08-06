import Siege from '../models/Siege.js';
import Account from '../models/Account.js';

export async function getSieges(req, res) {
    try {
        const accountId = req.params.accountId || req.query.accountId;
        if (!accountId) return res.status(400).json({ error: 'accountId required' });
        const sieges = await Siege.find({ account: accountId }).sort({ createdAt: 1 });
        return res.json(sieges);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

export async function getSiege(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'siege id required' });
        const siege = await Siege.findById(id);
        if (!siege) return res.status(404).json({ error: 'Siege not found' });
        return res.json(siege);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
