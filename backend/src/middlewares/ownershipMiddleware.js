import Account from '../models/Account.js';
import Pet from '../models/Pet.js';
import Building from '../models/Building.js';
import Hero from '../models/Hero.js';
import Troop from '../models/Troop.js';
import Siege from '../models/Siege.js';
import Spell from '../models/Spell.js';

// Helper to check account ownership by id
async function assertAccountOwnership(userId, accountId) {
    const account = await Account.findOne({ _id: accountId, owner: userId }).select('_id');
    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }
    return account;
}

export function ensureAccountAccessFromParam(paramName = 'id') {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Authentication required' });
            const accountId = req.params[paramName];
            const account = await assertAccountOwnership(userId, accountId);
            req.accountId = accountId;
            req.account = account;
            return next();
        } catch (err) {
            const status = err.status || 403;
            return res.status(status).json({ error: err.message || 'Forbidden' });
        }
    };
}

export function ensureAccountAccessFromBody(bodyKey = 'accountId') {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Authentication required' });
            const accountId = req.body?.[bodyKey];
            if (!accountId) return res.status(400).json({ error: `${bodyKey} is required` });
            const account = await assertAccountOwnership(userId, accountId);
            req.accountId = accountId;
            req.account = account;
            return next();
        } catch (err) {
            const status = err.status || 403;
            return res.status(status).json({ error: err.message || 'Forbidden' });
        }
    };
}

// Same as above but read accountId from query string (useful for GET /resource?accountId=...)
export function ensureAccountAccessFromQuery(queryKey = 'accountId') {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Authentication required' });
            const accountId = req.query?.[queryKey];
            if (!accountId) return res.status(400).json({ error: `${queryKey} is required` });
            await assertAccountOwnership(userId, accountId);
            return next();
        } catch (err) {
            const status = err.status || 403;
            return res.status(status).json({ error: err.message || 'Forbidden' });
        }
    };
}

// For item resources, verify the item belongs to an account owned by the user
function makeEnsureItemOwnership(Model, paramName = 'id') {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Authentication required' });
            const id = req.params[paramName] || req.body?.[paramName] || req.query?.[paramName];
            if (!id) return res.status(400).json({ error: `${paramName} is required` });
            const item = await Model.findById(id).select('account');
            if (!item) return res.status(404).json({ error: 'Resource not found' });
            await assertAccountOwnership(userId, item.account);
            return next();
        } catch (err) {
            const status = err.status || 403;
            return res.status(status).json({ error: err.message || 'Forbidden' });
        }
    };
}

export const ensurePetOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Pet, paramName);
export const ensureBuildingOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Building, paramName);
export const ensureHeroOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Hero, paramName);
export const ensureTroopOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Troop, paramName);
export const ensureSiegeOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Siege, paramName);
export const ensureSpellOwnershipFromParam = (paramName = 'id') => makeEnsureItemOwnership(Spell, paramName);
