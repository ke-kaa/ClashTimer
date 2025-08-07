import mongoose from 'mongoose';
import Spell from '../models/Spell.js';
import { startUpgrade } from '../utils/upgradeUtils.js';
import { createSpellService, getSpellsByAccountService, deleteSpellService, getSpellUpgradeStatus } from '../services/spellService.js';

export async function createSpellController(req, res, next) {
    try {
        const spell = await createSpellService(req.body);
        res.status(201).json(spell);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Failed to create spell' });
    }
}

export async function getSpellsController(req, res) {
    try {
        const { accountId } = req.query;

        if (!accountId || !isId(accountId)) {
            return res.status(400).json({ message: 'Valid accountId is required' });
        }

        const spells = await getSpellsByAccountService(accountId);
        return res.json(spells);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 
            error: 'Failed to fetch spells', 
        });
    }
}

export async function getSpellByIdController(req, res) {
    try {
        const spell = await getSpellByIdService(req.params.id);

        if (spell.account.toString() !== req.user.id) {
            throw { status: 403, message: 'Forbidden: You cannot access this spell' };
        }

        return res.json(spell);
    } catch (err) {

        if ( err.message === "Forbidden: You cannot access this spell" ){
            return res.status(404).json({ error: err.message });
        }
        
        return res
            .status(err?.status || 500)
            .json({ message: err?.message || 'Failed to fetch spell' });
    }
}

export async function deleteSpellController(req, res) {
    try {
        await deleteSpellService(req.params.id);
        return res.json({ message: 'Spell deleted' });
    } catch (err) {
        console.log(err.message)
        return res
            .status(err?.status || 500)
            .json({ message: 'Failed to delete spell' });
    }
}

export async function startSpellUpgradeController(req, res) {
    try {
        const { spellId, upgradeTimeSec, upgradeCost = 0 } = req.body;

        if (!spellId){
            return res.json(400).json({ error: "spellId required"});
        }
        if (upgradeTimeSec == null || isNaN(upgradeTimeSec) || upgradeTimeSec < 0) {
            return res.status(400).json({ error: 'upgradeTimeSec must be >= 0' });
        }

        const result = await startSpellUpgradeService(spellId, upgradeTimeSec, upgradeCost);
        return res.json(result)
    } catch (err) {
        if (err.message == 'Spell not found') return res.status(404).json({ error: err.message });
        console.log(err.message)
        return res.status(500).json({ message: 'Failed to start upgrade'});
    }
}

export async function finishSpellUpgradeController(req, res, next) {
    try {
        const { spellId } = req.body;
        if (!spellId) return res.status(400).json({ error: 'siegeId required' });

        const spell = await finishSpellUpgradeService(siegeId);
        res.json({ siege, finished: true });
    } catch (e) {
        if (e.message = "Siege not found"){
            return res.status(404).json({ error: e.message });
        }
        console.log(e.message);
        return res.status(500).json({ error: 'Internal server error.'})
    }
}

export async function getSpellUpgradeStatus(req, res) {
    try {
        const { id } = req.params;
        const spell = await Spell.findById(id);
        
        if (!spell) {
            return res.status(404).json({ error: 'Siege not found' });
        }
        
        const status = getSpellUpgradeStatus(spell);
        res.json(status);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: 'Failed to get upgrade status' });
    }
}
