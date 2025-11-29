export async function startUpgrade(item, upgradeTimeSec, upgradeCost = 0) {
    if (!item) throw new Error('Item not found');
    if (item.status === 'Upgrading') throw new Error(`${item.name} already upgrading`);
    if (item.currentLevel >= item.maxLevel) throw new Error('Item at max level');

    if (upgradeTimeSec === 0) {
        item.currentLevel = Math.min(item.currentLevel + 1, item.maxLevel);
        item.status = 'Idle';
        item.upgradeStartTime = null;
        item.upgradeEndTime = null;
        item.upgradeTime = 0;
        item.upgradeCost = upgradeCost;
        await item.save();
        return { item, instant: true };
    }

    const now = new Date();
    item.status = 'Upgrading';
    item.upgradeStartTime = now;
    item.upgradeEndTime = new Date(now.getTime() + upgradeTimeSec * 1000);
    item.upgradeTime = upgradeTimeSec;
    item.upgradeCost = upgradeCost;
    await item.save();

    return { item, instant: false };
}

export function canFinishUpgrade(entity) {
    if (entity.status !== 'Upgrading' || !entity.upgradeEndTime) return false;
    const now = Date.now();
    return now >= entity.upgradeEndTime.getTime();
}

export function finishUpgrade(entity) {
    if (entity.currentLevel < entity.maxLevel) {
        entity.currentLevel += 1;
    }
    entity.status = 'Idle';
    entity.upgradeStartTime = null;
    entity.upgradeEndTime = null;
    entity.upgradeTime = 0;

    return entity;
}