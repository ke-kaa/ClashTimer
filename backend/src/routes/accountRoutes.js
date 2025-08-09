import { Router } from 'express';
import {
    getAccounts,
    getAccountDetail,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountStats,
    getAccountsByClan,
    updateAccountPreferences,
    getAccountByPlayerTag,
    searchAccounts
} from '../controllers/accountController.js';

const router = Router();

// GET /api/accounts
router.get('/', getAccounts);

// GET /api/accounts/search?q=term
router.get('/search', searchAccounts);

// GET /api/accounts/playerTag/:playerTag
router.get('/playerTag/:playerTag', getAccountByPlayerTag);

// GET /api/accounts/:id
router.get('/:id', getAccountDetail);

// GET /api/accounts/:id/stats
router.get('/:id/stats', getAccountStats);

// PATCH /api/accounts/:id/preferences
router.patch('/:id/preferences', updateAccountPreferences);

// POST /api/accounts
router.post('/', createAccount);

// PATCH /api/accounts/:id
router.patch('/:id', updateAccount);

// DELETE /api/accounts/:id
router.delete('/:id', deleteAccount);

// GET /api/clans/:clanTag/accounts
router.get('/clan/by/:clanTag/list', getAccountsByClan); // alt path if you prefer: /api/clans/:clanTag/accounts

export default router;