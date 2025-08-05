import Pet from '../models/Pet.js';
import Account from '../models/Account.js';
import Hero from '../models/Hero.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

function resolveAccountId(req) {
	return req.params.accountId || req.body.accountId || req.query.accountId;
}

async function loadAccount(accountId) {
	if (!accountId) return null;
	return Account.findById(accountId);
}

// ------------------ Controllers ------------------ //

/** Get all pets for an account */
export async function getPets(req, res) {
	try {
		const accountId = resolveAccountId(req);
		if (!accountId) return res.status(400).json({ error: 'accountId is required' });
		const pets = await Pet.find({ account: accountId });
		return res.json(pets);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

/** Get single pet */
export async function getPet(req, res) {
	try {
		const petId = req.params.id || req.query.id;
		if (!petId) return res.status(400).json({ error: 'pet id required' });
		const pet = await Pet.findById(petId);
		if (!pet) return res.status(404).json({ error: 'Pet not found' });
		return res.json(pet);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
