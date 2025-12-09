import {
    getAllHeroesService,
    getHeroesByAccountService,
    getHeroByIdService,
    updateHeroLevelService,
    startHeroUpgradeService,
    completeHeroUpgradeService,
    cancelHeroUpgradeService,
    getHeroesByStatusService,
    getHeroUpgradeProgressService,
    validateHeroUpgradeService,
    getTopHeroesService,
    updateHeroUpgradeTimeService,
} from "../services/heroService.js";

function handleError(res, error) {
    return res.status(error.status || 500).json({ error: error.message });
}

export async function getAllHeroes(req, res) {
    try {
        const heroes = await getAllHeroesService(req.user?.id, req.query);
        return res.json(heroes);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getHeroesByAccount(req, res) {
    try {
        const heroes = await getHeroesByAccountService(
            req.user?.id,
            req.params.accountId
        );
        return res.json(heroes);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getHeroById(req, res) {
    try {
        const hero = await getHeroByIdService(req.params.id, req.user?.id);
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function updateHeroLevel(req, res) {
    try {
        const hero = await updateHeroLevelService(
            req.params.id,
            req.body.currentLevel,
            req.user?.id
        );
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function startHeroUpgrade(req, res) {
    try {
        const hero = await startHeroUpgradeService(
            req.params.id,
            req.body,
            req.user?.id
        );
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function updateHeroUpgradeTimeController(req, res) {
    try {
        const hero = await updateHeroUpgradeTimeService(
            req.params.id,
            req.body,
            req.user?.id
        );
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function completeHeroUpgrade(req, res) {
    try {
        const hero = await completeHeroUpgradeService(
            req.params.id,
            req.user?.id
        );
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function cancelHeroUpgrade(req, res) {
    try {
        const hero = await cancelHeroUpgradeService(
            req.params.id,
            req.user?.id
        );
        return res.json(hero);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getHeroesByStatus(req, res) {
    try {
        const heroes = await getHeroesByStatusService(
            req.params.status,
            req.query.accountId,
            req.user?.id
        );
        return res.json(heroes);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getHeroUpgradeProgress(req, res) {
    try {
        const result = await getHeroUpgradeProgressService(
            req.params.id,
            req.user?.id
        );
        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function validateHeroUpgrade(req, res) {
    try {
        const result = await validateHeroUpgradeService(
            req.params.id,
            req.user?.id
        );
        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

export async function getTopHeroes(req, res) {
    try {
        const heroes = await getTopHeroesService(
            req.params.accountId,
            req.user?.id
        );
        return res.json(heroes);
    } catch (error) {
        return handleError(res, error);
    }
}
