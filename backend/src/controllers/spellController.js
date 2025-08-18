import {
    createSpellService,
    getSpellsByAccountService,
    getSpellByIdService,
    deleteSpellService,
    startSpellUpgradeService,
    finishSpellUpgradeService,
    cancelSpellUpgradeService,
    getSpellUpgradeStatusService
} from '../services/spellService.js';

function handleError(res, error, fallbackMessage = 'Request failed') {
    const status = error?.status || 500;
    const payload = {
        error: error?.message || fallbackMessage,
        ...(error?.availableSpells ? { availableSpells: error.availableSpells } : {})
    };
    return res.status(status).json(payload);
}

function getAccountId(req) {
    return req.params.accountId || req.accountId;
}

function getUserId(req) {
    return req.user?.id || req.user?._id;
}

export async function createSpellController(req, res) {
    try {
        const accountId = getAccountId(req);
        const spell = await createSpellService(getUserId(req), accountId, req.body);
        return res.status(201).json(spell);
    } catch (error) {
        return handleError(res, error, 'Failed to create spell');
    }
}

export async function getSpellsController(req, res) {
    try {
        const accountId = getAccountId(req);
        const spells = await getSpellsByAccountService(getUserId(req), accountId);
        return res.json(spells);
    } catch (error) {
        return handleError(res, error, 'Failed to fetch spells');
    }
}

export async function getSpellByIdController(req, res) {
    try {
        const spell = await getSpellByIdService(getUserId(req), req.params.id);
        return res.json(spell);
    } catch (error) {
        return handleError(res, error, 'Failed to fetch spell');
    }
}

export async function deleteSpellController(req, res) {
    try {
        await deleteSpellService(getUserId(req), req.params.id);
        return res.json({ message: 'Spell deleted' });
    } catch (error) {
        return handleError(res, error, 'Failed to delete spell');
    }
}

export async function startSpellUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const spellId = req.params.spellId || req.body?.spellId;
        const result = await startSpellUpgradeService(getUserId(req), accountId, {
            ...req.body,
            spellId
        });
        return res.json(result);
    } catch (error) {
        return handleError(res, error, 'Failed to start upgrade');
    }
}

export async function finishSpellUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const spellId = req.params.spellId || req.body?.spellId;
        const spell = await finishSpellUpgradeService(getUserId(req), accountId, {
            ...req.body,
            spellId
        });
        return res.json({ spell, finished: true });
    } catch (error) {
        return handleError(res, error, 'Failed to finish upgrade');
    }
}

export async function cancelSpellUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const spellId = req.params.spellId || req.body?.spellId;
        const spell = await cancelSpellUpgradeService(getUserId(req), accountId, {
            ...req.body,
            spellId
        });
        return res.json({ spell, cancelled: true });
    } catch (error) {
        return handleError(res, error, 'Failed to cancel upgrade');
    }
}

export async function getSpellUpgradeStatus(req, res) {
    try {
        const spellId = req.params.id || req.query?.spellId;
        const status = await getSpellUpgradeStatusService(getUserId(req), spellId);
        return res.json(status);
    } catch (error) {
        return handleError(res, error, 'Failed to get upgrade status');
    }
}
