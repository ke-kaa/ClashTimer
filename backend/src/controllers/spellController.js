import mongoose from 'mongoose';
import Spell from '../models/Spell.js';

import { createSpellService, getSpellsByAccount } from '../services/spellService.js';

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

        const spells = await getSpellsByAccount(accountId);
        return res.json(spells);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 
            error: 'Failed to fetch spells', 
        });
    }
}
