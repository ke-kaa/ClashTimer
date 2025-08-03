import Building from '../models/Building.js';
import Account from '../models/Account.js';
import mongoose from 'mongoose';

export async function getAllBuildings(req, res) {
    try {
        const { accountId, status, buildingType } = req.query;
        let query = {};

        // Filter by account if provided
        if (accountId) {
            query.account = accountId;
        }

        // Filter by status if provided
        if (status && ['Idle', 'Upgrading'].includes(status)) {
            query.status = status;
        }

        // Filter by building type/name if provided
        if (buildingType) {
            query.name = { $regex: buildingType, $options: 'i' };
        }

        const buildings = await Building.find(query).populate('account', 'username townHallLevel');
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getBuildingById(req, res) {
    try {
        const building = await Building.findById(req.params.id).populate('account', 'username townHallLevel');
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        return res.json(building);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getBuildingsByAccount(req, res) {
    try {
        const { accountId } = req.params;
        const buildings = await Building.find({ account: accountId }).populate('account', 'username townHallLevel');
        return res.json(buildings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateBuildingLevel(req, res) {
    try {
        const { id } = req.params;
        const { currentLevel } = req.body;

        if (currentLevel === undefined || !Number.isInteger(currentLevel) || currentLevel < 0) {
            return res.status(400).json({ error: 'Invalid current level. Must be a non-negative integer.' });
        }

        const building = await Building.findById(id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        if (currentLevel > building.maxLevel) {
            return res.status(400).json({ error: 'Current level cannot exceed maximum level' });
        }

        building.currentLevel = currentLevel;
        await building.save();

        return res.json(building);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function startBuildingUpgrade(req, res) {
    try {
        const { id } = req.params;
        const { upgradeCost, upgradeTime } = req.body;
        const building = await Building.findById(id);
        
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        if (building.status === 'Upgrading') {
            return res.status(400).json({ error: 'Building is already upgrading' });
        }

        if (building.currentLevel >= building.maxLevel) {
            return res.status(400).json({ error: 'Building is already at maximum level' });
        }

        const now = new Date();
        const upgradeEndTime = new Date(now.getTime() + (upgradeTime || 0) * 1000);

        building.status = 'Upgrading';
        building.upgradeStartTime = now;
        building.upgradeEndTime = upgradeEndTime;
        building.upgradeCost = upgradeCost || 0;
        building.upgradeTime = upgradeTime || 0;
        await building.save();

        return res.json(building);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
