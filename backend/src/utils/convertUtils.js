export const toNumber = (v) => (v === undefined || v === null ? undefined : Number(v));

export const normalizeKey = (s = '') => s.toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
