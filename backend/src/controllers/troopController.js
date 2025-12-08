import {
    createTroopService,
    getTroopsByAccountService,
    getTroopByIdService,
    deleteTroopService,
    startTroopUpgradeService,
    finishTroopUpgradeService,
    cancelTroopUpgradeService,
    getTroopUpgradeStatusService,
} from "../services/troopService.js";

function handleError(res, error, fallbackMessage = "Request failed") {
    const status = error?.status || 500;
    const payload = {
        error: error?.message || fallbackMessage,
        ...(error?.availableTroops
            ? { availableTroops: error.availableTroops }
            : {}),
    };
    return res.status(status).json(payload);
}

function getUserId(req) {
    return req.user?.id || req.user?._id;
}

function getAccountId(req) {
    return req.params.accountId || req.accountId;
}

export async function createTroopController(req, res) {
    try {
        const accountId = getAccountId(req);
        const troop = await createTroopService(
            getUserId(req),
            accountId,
            req.body
        );
        return res.status(201).json(troop);
    } catch (error) {
        return handleError(res, error, "Failed to create troop");
    }
}

export async function getTroopsByAccountIdController(req, res) {
    try {
        const accountId = getAccountId(req);
        const troops = await getTroopsByAccountService(
            getUserId(req),
            accountId
        );
        return res.json(troops);
    } catch (error) {
        return handleError(res, error, "Failed to fetch troops");
    }
}

export async function getTroopByIdController(req, res) {
    try {
        const troop = await getTroopByIdService(getUserId(req), req.params.id);
        return res.json(troop);
    } catch (error) {
        return handleError(res, error, "Failed to fetch troop");
    }
}

export async function deleteTroopController(req, res) {
    try {
        await deleteTroopService(getUserId(req), req.params.id);
        return res.json({ message: "Troop deleted" });
    } catch (error) {
        return handleError(res, error, "Failed to delete troop");
    }
}

export async function startTroopUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const troopId = req.params.troopId || req.body?.troopId;
        const result = await startTroopUpgradeService(
            getUserId(req),
            accountId,
            {
                ...req.body,
                troopId,
            }
        );
        return res.json(result);
    } catch (error) {
        console.error("startTroopUpgradeController error:", error);
        return res
            .status(error.status || 500)
            .json({ error: error.message || "Failed to start troop upgrade" });
    }
}

export async function finishTroopUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const troopId = req.params.troopId || req.body?.troopId;
        const troop = await finishTroopUpgradeService(
            getUserId(req),
            accountId,
            {
                ...req.body,
                troopId,
            }
        );
        return res.json({ troop, finished: true });
    } catch (error) {
        return handleError(res, error, "Failed to finish upgrade");
    }
}

export async function cancelTroopUpgradeController(req, res) {
    try {
        const accountId = getAccountId(req);
        const troopId = req.params.troopId || req.body?.troopId;
        const troop = await cancelTroopUpgradeService(
            getUserId(req),
            accountId,
            {
                ...req.body,
                troopId,
            }
        );
        return res.json({ troop, cancelled: true });
    } catch (error) {
        return handleError(res, error, "Failed to cancel upgrade");
    }
}

export async function getTroopUpgradeStatus(req, res) {
    try {
        const troopId = req.params.id || req.query?.troopId;
        const status = await getTroopUpgradeStatusService(
            getUserId(req),
            troopId
        );
        return res.json(status);
    } catch (error) {
        return handleError(res, error, "Failed to get upgrade status");
    }
}
