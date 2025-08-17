import {
    getPetsService,
    getPetByIdService,
    unlockPetService,
    assignPetToHeroService,
    unassignPetService,
    startPetUpgradeService,
    getPetUpgradeStatusService,
    finishPetUpgradeService,
    cancelPetUpgradeService
} from '../services/petService.js';

function handleError(res, error) {
    return res.status(error.status || 500).json({ error: error.message, ...(error.availablePets ? { availablePets: error.availablePets } : {}) });
}

export async function getPets(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const pets = await getPetsService(req.user?.id, accountId);
        return res.json(pets);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getPet(req, res) {
    try {
        const petId = req.params.id || req.query.id;
        const pet = await getPetByIdService(req.user?.id, petId);
        return res.json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function unlockPet(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const pet = await unlockPetService(req.user?.id, accountId, req.body);
        return res.status(201).json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function assignPetToHero(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const petId = req.params.petId || req.body?.petId;
        const pet = await assignPetToHeroService(req.user?.id, accountId, { ...req.body, petId });
        return res.json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function unassignPet(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const petId = req.params.petId || req.body?.petId;
        const pet = await unassignPetService(req.user?.id, accountId, petId);
        return res.json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function startPetUpgrade(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const petId = req.params.petId || req.body?.petId;
        const result = await startPetUpgradeService(req.user?.id, accountId, { ...req.body, petId });
        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

// progress in % - it uses the user input time not the actual time of the official clash of clans upgrade 
// future improvement (too lazy to implement now) - the progress status (percentage) should be based on some config file containig the actual upgrade time
export async function getPetUpgradeStatus(req, res) {
    try {
        const petId = req.params.id || req.query.petId;
        const status = await getPetUpgradeStatusService(req.user?.id, petId);
        return res.json(status);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function finishPetUpgrade(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const petId = req.params.petId || req.body?.petId;
        const pet = await finishPetUpgradeService(req.user?.id, accountId, { ...req.body, petId });
        return res.json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function cancelPetUpgrade(req, res) {
    try {
        const accountId = req.params.accountId || req.accountId;
        const petId = req.params.petId || req.body?.petId;
        const pet = await cancelPetUpgradeService(req.user?.id, accountId, { ...req.body, petId });
        return res.json(pet);
    } catch (error) {
        return handleError(res, error);
    }
}

export default {
    getPets,
    getPet,
    unlockPet,
    assignPetToHero,
    unassignPet,
    startPetUpgrade,
    getPetUpgradeStatus,
    finishPetUpgrade,
    cancelPetUpgrade
};