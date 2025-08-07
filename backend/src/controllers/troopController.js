import Troop from "../models/Troop";
import { createTroopService, getTroopByAccountService, getTroopByIdService, deleteTroopService, startTroopUpgradeService, finishTroopUpgradeService, getTroopUpgradeStatus  } from "../services/troopService";

export async function createTroopController(req, res, next) {
    try {
        const troop = await createTroopService(req.body);
        res.status(201).json(troop);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Failed to create troop' });
    }
}

export async function getTroopsByAccountIdController(req, res) {
    try {
        const { accountId } = req.query;

        if (!accountId || !isId(accountId)) {
            return res.status(400).json({ message: 'Valid accountId is required' });
        }

        const troops = await getTroopByAccountService(accountId);
        return res.json(troops);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 
            error: 'Failed to fetch troops', 
        });
    }
}

export async function getTroopByIdController(req, res) {
    try {
        const troop = await getTroopByIdService(req.params.id);

        if (troop.account.toString() !== req.user.id) {
            throw { status: 403, message: 'Forbidden: You cannot access this troop' };
        }

        return res.json(troop);
    } catch (err) {

        if ( err.message === "Forbidden: You cannot access this troop" ){
            return res.status(404).json({ error: err.message });
        }
        
        return res
            .status(err?.status || 500)
            .json({ message: err?.message || 'Failed to fetch troop' });
    }
}

export async function deleteTroopController(req, res) {
    try {
        await deleteTroopService(req.params.id);
        return res.json({ message: 'Troop deleted' });
    } catch (err) {
        console.log(err.message)
        return res
            .status(err?.status || 500)
            .json({ message: 'Failed to delete troop' });
    }
}

export async function startTroopUpgradeController(req, res) {
    try {
        const { troopId, upgradeTimeSec, upgradeCost = 0 } = req.body;

        if (!troopId){
            return res.json(400).json({ error: "troopId required"});
        }
        if (upgradeTimeSec == null || isNaN(upgradeTimeSec) || upgradeTimeSec < 0) {
            return res.status(400).json({ error: 'upgradeTimeSec must be >= 0' });
        }

        const result = await startTroopUpgradeService(troopId, upgradeTimeSec, upgradeCost);
        return res.json(result)
    } catch (err) {
        if (err.message == 'troop not found') return res.status(404).json({ error: err.message });
        console.log(err.message)
        return res.status(500).json({ message: 'Failed to start upgrade'});
    }
}

export async function finishTroopUpgradeController(req, res, next) {
    try {
        const { troopId } = req.body;
        if (!troopId) return res.status(400).json({ error: 'troopId required' });

        const troop = await finishTroopUpgradeService(troopId);
        res.json({ siege, finished: true });
    } catch (e) {
        if (e.message = "Troop not found"){
            return res.status(404).json({ error: e.message });
        }
        console.log(e.message);
        return res.status(500).json({ error: 'Internal server error.'})
    }
}

export async function getTroopUpgradeStatus(req, res) {
    try {
        const { id } = req.params;
        const troop = await troop.findById(id);
        
        if (!troop) {
            return res.status(404).json({ error: 'Siege not found' });
        }
        
        const status = getTroopUpgradeStatus(troop);
        res.json(status);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: 'Failed to get upgrade status' });
    }
}