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

export async function assignPetToHero(req, res) {
    try {
        const { petId, heroId } = req.body;
        if (!petId || !heroId) return res.status(400).json({ error: 'petId and heroId required' });
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        if (pet.status === 'Upgrading') return res.status(400).json({ error: 'Cannot assign while upgrading' });
        if (pet.assignedHero) return res.status(409).json({ error: 'Pet already assigned' });

		// Load account to confirm hero ownership (using pet.account reference)
		const account = await Account.findById(pet.account).select('heroes');
		if (!account) return res.status(404).json({ error: 'Account not found for pet' });

		const hero = await Hero.findById(heroId);
		if (!hero) return res.status(404).json({ error: 'Hero not found' });

		// Check hero is listed under this account's heroes array
		const heroOwned = account.heroes.some(h => h.toString() === heroId.toString());
		if (!heroOwned) {
			return res.status(403).json({ error: 'Hero does not belong to this account' });
		}

		pet.assignedHero = heroId;
		await pet.save();
		return res.json(pet);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function unassignPet(req, res) {
	try {
		const { petId } = req.body;
		const accountId = resolveAccountId(req); // optional but used for ownership validation if provided
		if (!petId) return res.status(400).json({ error: 'petId required' });

		const pet = await Pet.findById(petId);
		if (!pet) return res.status(404).json({ error: 'Pet not found' });

		// Ownership check (if caller passed an accountId ensure it matches pet.account)
		if (accountId && pet.account.toString() !== accountId.toString()) {
			return res.status(403).json({ error: 'Pet does not belong to this account' });
		}

		if (!pet.assignedHero) {
			return res.status(409).json({ error: 'Pet already unassigned' });
		}

		pet.assignedHero = null;
		await pet.save();
		return res.json(pet);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

export async function startPetUpgrade(req, res) {
	try {
		const { petId, upgradeTimeSec, upgradeCost } = req.body;
		if (!petId) return res.status(400).json({ error: 'petId required' });
		if (upgradeTimeSec === undefined || upgradeTimeSec === null) {
			return res.status(400).json({ error: 'upgradeTimeSec required (seconds)' });
		}
		const timeNum = Number(upgradeTimeSec);
		if (!Number.isFinite(timeNum) || timeNum < 0) {
			return res.status(400).json({ error: 'upgradeTimeSec must be a non-negative number' });
		}
		const pet = await Pet.findById(petId);
		if (!pet) return res.status(404).json({ error: 'Pet not found' });
		if (pet.status === 'Upgrading') return res.status(409).json({ error: 'Pet already upgrading' });
		if (pet.currentLevel >= pet.maxLevel) return res.status(400).json({ error: 'Pet already at max level' });

		// If time is zero, perform instant upgrade and return
		if (timeNum === 0) {
			pet.currentLevel += 1;
			if (pet.currentLevel >= pet.maxLevel) {
				pet.currentLevel = pet.maxLevel; // clamp
			}
			pet.status = 'Idle';
			pet.upgradeStartTime = null;
			pet.upgradeEndTime = null;
			pet.upgradeTime = 0;
			pet.upgradeCost = Number(upgradeCost) || 0;
			await pet.save();
			return res.json({ pet, instant: true });
		}

		const now = new Date();
		const end = new Date(now.getTime() + timeNum * 1000);
		pet.status = 'Upgrading';
		pet.upgradeStartTime = now;
		pet.upgradeEndTime = end;
		pet.upgradeCost = Number(upgradeCost) || 0;
		pet.upgradeTime = timeNum;
		await pet.save();
		return res.json(pet);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

// progress in % - it uses the user input time not the actual time of the official clash of clans upgrade 
export async function getPetUpgradeStatus(req, res) {
	try {
		const petId = req.params.id || req.query.petId;
		if (!petId) return res.status(400).json({ error: 'pet id required' });
		const pet = await Pet.findById(petId);
		if (!pet) return res.status(404).json({ error: 'Pet not found' });
		if (pet.status !== 'Upgrading' || !pet.upgradeStartTime || !pet.upgradeEndTime) {
			return res.json({ petId: pet._id, status: pet.status, progress: pet.status === 'Idle' ? 100 : 0 });
		}
		const now = Date.now();
		const total = pet.upgradeEndTime.getTime() - pet.upgradeStartTime.getTime();
		const elapsed = Math.min(now - pet.upgradeStartTime.getTime(), total);
		const percent = total > 0 ? Math.round((elapsed / total) * 100) : 0;
		const finished = now >= pet.upgradeEndTime.getTime();
		return res.json({
			petId: pet._id,
			status: finished ? 'Finished (pending finalize)' : pet.status,
			progress: finished ? 100 : percent,
			remainingSeconds: finished ? 0 : Math.max(0, Math.ceil((pet.upgradeEndTime.getTime() - now)/1000)),
			endsAt: pet.upgradeEndTime,
		});
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}