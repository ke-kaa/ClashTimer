import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { ensureAccountAccessFromParam } from '../middlewares/ownershipMiddleware.js';
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
    searchAccounts,
    getAccountsForDashboardController,
    getVillageController,
    addVillageDetailController,
    updateAccountDataFRomPasteController,
} from '../controllers/accountController.js';

const router = Router();

// GET /api/accounts -----------
router.get('/', requireAuth, getAccounts); 

router.get('/dashboard/addVillage/:playerTag', requireAuth, getVillageController); 

router.post('/dashboard/addVillage/add', requireAuth, addVillageDetailController ); 

router.get('/dashboard', requireAuth, getAccountsForDashboardController); 

// POST /api/accounts ------------
router.post('/', requireAuth, createAccount);

// GET /api/accounts/search?q=term -----------
router.get('/search', requireAuth, searchAccounts);

// GET /api/accounts/:playerTag ----------
router.get('/:playerTag', requireAuth, getAccountByPlayerTag);

// GET /api/accounts/:id ------------
router.get('/:id', requireAuth, ensureAccountAccessFromParam('id'), getAccountDetail);

// GET /api/accounts/:id/stats -----------
router.get('/:id/stats', requireAuth, ensureAccountAccessFromParam('id'), getAccountStats);

// PATCH /api/accounts/:id/preferences
router.patch('/:id/preferences', requireAuth, ensureAccountAccessFromParam('id'), updateAccountPreferences);

// PATCH /api/accounts/:id
router.patch('/:id', requireAuth, ensureAccountAccessFromParam('id'), updateAccount);

// DELETE /api/accounts/:id
router.delete('/:id', requireAuth, ensureAccountAccessFromParam('id'), deleteAccount);

// POST /api/account/paste 
router.post('/paste', requireAuth, updateAccountDataFRomPasteController);

// GET /api/clans/:clanTag/accounts
router.get('/clan/by/:clanTag/list', requireAuth, getAccountsByClan); // alt path if you prefer: /api/clans/:clanTag/accounts

export default router;