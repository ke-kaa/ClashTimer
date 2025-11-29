import { getWallGroupService, upgradeWallLevelsService, getWallStatsService } from '../services/wallService.js';

export async function getWallGroup(req, res) {
	try {
		const { accountId } = req.params;
		const result = await getWallGroupService({ userId: req.user?.id, accountId });
		return res.json(result);
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Failed to fetch wall group' });
	}
}

export async function upgradeWallLevels(req, res) {
	try {
		const { accountId } = req.params;
		const { fromLevel, toLevel, count } = req.body || {};
		const { wallGroup, totalAllowed } = await upgradeWallLevelsService({
			userId: req.user?.id,
			accountId,
			fromLevel,
			toLevel,
			count
		});
		return res.json({
			wallGroup,
			totalAllowed
		});
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Failed to update wall levels' });
	}
}

export async function getWallStats(req, res) {
	try {
		const { accountId } = req.params;
		const stats = await getWallStatsService({ userId: req.user?.id, accountId });
		return res.json(stats);
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Failed to fetch wall stats' });
	}
}
