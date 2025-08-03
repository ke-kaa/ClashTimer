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
