export function computeUpgradeStatus(item) {
    if (
        item.status !== 'Upgrading' ||
        !item.upgradeStartTime ||
        !item.upgradeEndTime
    ) {
        return {
            status: item.status,
            progress: item.status === 'Idle' ? 100 : 0,
            remainingSeconds: 0
        };
    }

    const now = Date.now();
    const total = item.upgradeEndTime.getTime() - item.upgradeStartTime.getTime();
    const elapsed = Math.min(now - item.upgradeStartTime.getTime(), total);

    const percent = total > 0 ? Math.round((elapsed / total) * 100) : 0;
    const finished = now >= item.upgradeEndTime.getTime();

    return {
        status: finished ? 'Finished (pending finalize)' : item.status,
        progress: finished ? 100 : percent,
        remainingSeconds: finished
            ? 0
            : Math.ceil((item.upgradeEndTime.getTime() - now) / 1000),
        endsAt: item.upgradeEndTime
    };
}
