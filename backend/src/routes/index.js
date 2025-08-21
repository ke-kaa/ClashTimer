import { Router } from 'express';
import accountRoutes from './accountRoutes.js';
import authRoutes from './AuthRoutes.js';
import troopRoutes from './troopRoutes.js';
import spellRoutes from './spellRoutes.js';
import siegeRoutes from './siegeRoutes.js';
import petRoutes from './petRoutes.js';
import heroRoutes from './heroRoutes.js';
import buildingRoutes from './buildingRoutes.js';
import wallRoutes from './wallRoutes.js';

const api = Router();

// Mount under /api in server (app.use('/api', api))
api.use('/auth', authRoutes);
api.use('/accounts', accountRoutes);
api.use('/troops', troopRoutes);
api.use('/spells', spellRoutes);
api.use('/sieges', siegeRoutes);
api.use('/pets', petRoutes);
api.use('/heroes', heroRoutes);
api.use('/buildings', buildingRoutes);
api.use('/walls', wallRoutes);

export default api;