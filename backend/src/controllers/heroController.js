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

// Update hero level (direct set)
export async function updateHeroLevel(req, res) {
    try {
        const { id } = req.params;
        const { currentLevel } = req.body;
        if (currentLevel === undefined || !Number.isInteger(currentLevel) || currentLevel < 0) {
            return res.status(400).json({ error: 'Invalid current level' });
        }

        const hero = await Hero.findById(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        if (currentLevel > hero.maxLevel) return res.status(400).json({ error: 'Current level cannot exceed max level' });

        hero.currentLevel = currentLevel;
        await hero.save();
        return res.json(hero);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function startHeroUpgrade(req, res) {
    try {
        const { id } = req.params;
        const { upgradeCost, upgradeTime } = req.body; // seconds
        const hero = await Hero.findById(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        if (hero.status === 'Upgrading') return res.status(400).json({ error: 'Hero is already upgrading' });
        if (hero.currentLevel >= hero.maxLevel) return res.status(400).json({ error: 'Hero is already at maximum level' });

        const now = new Date();
        const end = new Date(now.getTime() + (upgradeTime || 0) * 1000);
        hero.status = 'Upgrading';
        hero.upgradeStartTime = now;
        hero.upgradeEndTime = end;
        hero.upgradeCost = upgradeCost || 0;
        hero.upgradeTime = upgradeTime || 0;
        await hero.save();

        return res.json(hero);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// increments level by 1
export async function completeHeroUpgrade(req, res) {
    try {
        const { id } = req.params;
        const hero = await Hero.findById(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        if (hero.status !== 'Upgrading') return res.status(400).json({ error: 'Hero is not currently upgrading' });
        if (hero.currentLevel >= hero.maxLevel) return res.status(400).json({ error: 'Hero is already at maximum level' });

        hero.currentLevel += 1;
        hero.status = 'Idle';
        hero.upgradeStartTime = null;
        hero.upgradeEndTime = null;
        hero.upgradeCost = 0;
        hero.upgradeTime = 0;
        await hero.save();

        await Account.findByIdAndUpdate(hero.account, { $inc: { totalUpgrades: 1 } });

        return res.json(hero);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function cancelHeroUpgrade(req, res) {
    try {
        const { id } = req.params;
        const hero = await Hero.findById(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        if (hero.status !== 'Upgrading') return res.status(400).json({ error: 'Hero is not currently upgrading' });

        hero.status = 'Idle';
        hero.upgradeStartTime = null;
        hero.upgradeEndTime = null;
        await hero.save();
        return res.json(hero);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getHeroesByStatus(req, res) {
    try {
        const { status } = req.params;
        const { accountId } = req.query;
        if (!['Idle', 'Upgrading'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const query = { status };
        if (accountId) query.account = accountId;
        const heroes = await Hero.find(query).populate('account', 'username townHallLevel');
        return res.json(heroes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
