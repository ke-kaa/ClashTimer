import mongoose from 'mongoose';
import Spell from '../models/Spell.js';

import { createSpellService } from '../services/spellService.js';

export async function createSpellController(req, res, next) {
    try {
        const spell = await createSpellService(req.body);
        res.status(201).json(spell);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Failed to create spell' });
    }
}

