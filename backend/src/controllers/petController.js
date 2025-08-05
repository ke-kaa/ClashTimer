import Pet from '../models/Pet.js';
import Account from '../models/Account.js';
import Hero from '../models/Hero.js';
import { itemsByTownHall } from '../utils/itemsByTownHall.js';

// Mapping between config pet keys and Pet schema enum values
const petConfigKeyToEnum = {
	lassi: 'L.A.S.S.I',
	electroOwl: 'Electro Owl',
	mightyYak: 'Mighty Yak',
	unicorn: 'Unicorn',
	phoenix: 'Phoenix',
	poisonLizard: 'Poison Lizard',
	diggy: 'Diggy',
	frosty: 'Frosty',
	spiritFox: 'Spirit Fox',
	angryJelly: 'Angry Jelly'
};

function normalizePetInput(str = '') {
	return str.toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
}

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

export async function unlockPet(req, res) {
	try {
		const accountId = resolveAccountId(req);
		if (!accountId) return res.status(400).json({ error: 'accountId required' });

		const account = await loadAccount(accountId);
		if (!account) return res.status(404).json({ error: 'Account not found' });

		const { petType, petName, name } = req.body || {};
		const rawInput = petType || petName || name; // frontend may send either petType or pet name
		if (!rawInput) return res.status(400).json({ error: 'petType or pet name required' });

		const thLevel = account.townHallLevel;
		const thData = itemsByTownHall[thLevel];
		if (!thData || !Array.isArray(thData.pets)) {
			return res.status(400).json({ error: 'No pets available at this Town Hall level' });
		}

		const normInput = normalizePetInput(rawInput);

		// Build a lookup from normalized forms to config key
		const petsAvailable = thData.pets; // array of { petName, currentLevel, maxLevel }
		let matchedConfigKey = null;
		let matchedConfigEntry = null;

		for (const entry of petsAvailable) {
			const configKey = entry.petName; // e.g., lassi, electroOwl
			const enumCandidate = petConfigKeyToEnum[configKey];
			const norms = new Set([
				normalizePetInput(configKey),
				enumCandidate ? normalizePetInput(enumCandidate) : null
			].filter(Boolean));
			if (norms.has(normInput)) {
				matchedConfigKey = configKey;
				matchedConfigEntry = entry;
				break;
			}
		}

		if (!matchedConfigKey) {
			// Provide list of available pets at this TH in enum form
			const available = petsAvailable
				.map(p => petConfigKeyToEnum[p.petName])
				.filter(Boolean);
			return res.status(404).json({
				error: 'Pet not available at this Town Hall level',
				availablePets: available
			});
		}

		// Map to schema enum value
		const enumValue = petConfigKeyToEnum[matchedConfigKey];
		if (!enumValue) {
			return res.status(500).json({ error: 'Mapping for pet not defined in schema enum', pet: matchedConfigKey });
		}

		// Check duplicate unlock
		const existing = await Pet.findOne({ account: accountId, petType: enumValue });
		if (existing) {
			return res.status(409).json({ error: 'Pet already unlocked for this account', petType: enumValue });
		}

		const maxLevelFromConfig = matchedConfigEntry.maxLevel ?? 1;

		const petDoc = new Pet({
			name: enumValue, // or could store friendly name separately
			petType: enumValue,
			currentLevel: 0,
			maxLevel: maxLevelFromConfig,
			account: accountId
		});
		await petDoc.save();
		account.pets.push(petDoc._id);
		await account.save();

		return res.status(201).json(petDoc);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}