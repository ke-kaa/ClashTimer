import Hero from '../models/Hero.js';
import Account from '../models/Account.js';

// Get all heroes (optional filters via query)
export async function getAllHeroes(req, res) {
    try {
        const { accountId, status, heroType, name } = req.query;
        const query = {};

        if (accountId) query.account = accountId;
        if (status && ['Idle', 'Upgrading'].includes(status)) query.status = status;
        if (heroType) query.heroType = heroType;
        if (name) query.name = { $regex: name, $options: 'i' };

        const heroes = await Hero.find(query).populate('account', 'username townHallLevel');
        return res.json(heroes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getHeroesByAccount(req, res) {
    try {
        const { accountId } = req.params;
        const heroes = await Hero.find({ account: accountId }).populate('account', 'username townHallLevel');
        return res.json(heroes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getHeroById(req, res) {
    try {
        const { id } = req.params;
        const hero = await Hero.findById(id).populate('account', 'username townHallLevel');
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        return res.json(hero);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
