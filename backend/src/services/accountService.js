import mongoose from "mongoose";
import Account from "../models/Account.js";
import { itemsByTownHall, maxTownHallLevel } from "../utils/itemsByTownHall.js";  
import Building from "../models/Building.js";
import Hero from "../models/Hero.js";
import Pet from "../models/Pet.js";
import Siege from "../models/Siege.js";
import Spell from "../models/Spell.js";
import Troop from "../models/Troop.js";
import WallGroup from "../models/WallGroup.js";
import { createWallGroupForTownHall } from "./wallService.js";
import getPlayer  from "./external/cocAPI.js";
import NodeCache from 'node-cache';
import { randomUUID } from "crypto";
import createHttpError from 'http-errors';
import fs from 'fs/promises';
import path from 'path';
import static_data from '../utils/static_data.json' with { type: "json" };
import strict from "assert/strict";

const filePath = path.resolve(process.cwd(), 'data.json');

const myCache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

export async function getVillageOverviewsService({ userId }) {
    const userAccounts = await Account.find({ owner: userId })
                            .select('username playerTag townHallLevel expLevel warStars');
    const townHalls = userAccounts.map(item => item.townHallLevel);
    const expLevel = userAccounts.map(item => userAccounts.expLevel);
    const warStars = userAccounts.map(item => userAccounts.warStars);

    const overview = {
        villagesLinked: userAccounts.length,
        highestTownHall: Math.max(...townHalls),
        lowestTownHall: Math.min(...townHalls),
        highestXP: Math.max(...expLevel),
        lowestXP: Math.min(...expLevel),
        highestClanWarStars: Math.max(...warStars),
        lowestClanWarStars: Math.min(...warStars)
    }

    return overview;
}

export async function getVillageService(playerTag) {
    const playerData = await getPlayer(playerTag);

    if (!playerData) {
        throw createHttpError(404, 'No player data found from clash of clans.');
    }

    const {
        name,
        tag,
        townHallLevel,
        warStars,
        expLevel
    } = playerData;

    const cacheKey = randomUUID();

    const villageData = {
        "summary": { name, tag, townHallLevel, warStars, expLevel },
        "cacheKey": cacheKey
    }

    const success = myCache.set(cacheKey, playerData, 3000 );
    console.log("saved succuss: ", success);

    return villageData;
};

export async function addVillageDetailService({userId, cacheKey}){
    const playerData = myCache.get(cacheKey);
    const datas = myCache.keys();
    console.log("cached datas: ", datas);

    if (!playerData) {
        throw createHttpError(410, 'No cached village data. Please search again.');
    }

    const {
        name,
        tag,
        townHallLevel,
        clan
    } = playerData;

    
    const clanTag = clan?.tag || null;

    const account = createAccountFromClashAPIService({userId, username: name, playerTag: tag, townHallLevel, clanTag, playerData });
    return account;
}

export async function getAccountsService({ userId, clanTag, townHallLevel, playerTag, sortBy }) {
    let query = { owner: userId };

    // Filter by clan tag if provided
    if (clanTag) {
        query.clanTag = clanTag;
    }
    // Filter by town hall level if provided
    if (townHallLevel) {
        query.townHallLevel = parseInt(townHallLevel);
    }
    // Filter by player tag if provided
    if (playerTag) {
        query.playerTag = playerTag;
    }

    let accounts = await Account.find(query);

    if (sortBy) {
            switch (sortBy) {
                case 'username':
                    accounts.sort((a, b) => a.username.localeCompare(b.username));
                    break;
                case 'townHallLevel':
                    accounts.sort((a, b) => b.townHallLevel - a.townHallLevel);
                    break;
                case 'lastActive':
                    accounts.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                    break;
                case 'totalUpgrades':
                    accounts.sort((a, b) => b.totalUpgrades - a.totalUpgrades);
                    break;
                default:
                    break;
            }
    }

    return accounts;
}

export async function getAccountsForDashboardService(userId){
    let accounts = await Account.find({ owner: userId })
        .select('username playerTag townHallLevel clanTag lastActive totalUpgrades preferences')
        .sort({ lastActive: -1 });

    return accounts;
}

export async function getAccountDetailService(userId, accountId){
    const account = await Account.findOne({ _id: accountId, owner: userId })
        .populate('buildings')
        .populate('heroes')
        .populate('pets')
        .populate('siege')
        .populate('spells')
        .populate('troops')
        .populate('walls')
    
    if (!account) throw { status: 404, message: 'Account not found' };

    account.lastActive = new Date();
    await account.save();

    const accountProgress = calculateAccountProgress(account);
    account.set('progress', accountProgress, { strict: false});
    return account;
}

export async function createAccountService({ userId, username, playerTag, townHallLevel, clanTag, preferences }) {
    const session = await mongoose.startSession();
    try {
        let createdAccount = null;
        await session.withTransaction(async () => {
            if (playerTag) {
                const existingAccount = await Account.findOne({ playerTag }).session(session);
                if (existingAccount) {
                    const err = new Error('Player tag already exists.');
                    err.status = 404;
                    throw err;
                }
            }

            const thData = itemsByTownHall[townHallLevel];
            if (!thData) {
                const err = new Error('Invalid Town Hall level configuration');
                err.status = 400;
                throw err;
            }

            const account = new Account({
                owner: userId,
                username,
                playerTag: playerTag || null,
                townHallLevel,
                clanTag: clanTag || null,
                lastActive: new Date(),
                totalUpgrades: 0,
                preferences: {
                    notifications: preferences?.notifications ?? true,
                    theme: preferences?.theme ?? 'light',
                    language: preferences?.language ?? 'en'
                },
                walls: null
            });

            const buildingIds = [];
            const heroIds = [];
            const troopIds = [];
            const petIds = [];
            const siegeIds = [];
            const spellIds = [];

            for (const b of thData.buildings ?? []) {
                for (let i = 0; i < (b.count ?? 0); i++) {
                    const building = new Building({
                        name: b.name,
                        buildingType: b.type || 'Special',
                        currentLevel: 0,
                        maxLevel: b.maxLevel,
                        status: 'Idle',
                        account: account._id
                    });
                    await building.save({ session });
                    buildingIds.push(building._id);
                }
            }

            for (const h of thData.heroes ?? []) {
                const hero = new Hero({
                    name: h.name,
                    heroType: h.type || h.name,
                    currentLevel: 0,
                    maxLevel: h.maxLevel,
                    status: 'Idle',
                    account: account._id
                });
                await hero.save({ session });
                heroIds.push(hero._id);
            }

            for (const p of thData.pets ?? []) {
                const pet = new Pet({
                    name: p.name,
                    petType: p.name,
                    currentLevel: 0,
                    maxLevel: p.maxLevel,
                    status: 'Idle',
                    account: account._id
                });
                await pet.save({ session });
                petIds.push(pet._id);
            }

            for (const s of thData.sieges ?? []) {
                const siege = new Siege({
                    name: s.name,
                    siegeType: s.type || s.name,
                    currentLevel: 0,
                    maxLevel: s.maxLevel,
                    status: 'Idle',
                    account: account._id
                });
                await siege.save({ session });
                siegeIds.push(siege._id);
            }

            for (const s of thData.spells ?? []) {
                const spell = new Spell({
                    name: s.name,
                    spellType: s.type || 'Elixir',
                    currentLevel: 0,
                    maxLevel: s.maxLevel,
                    status: 'Idle',
                    account: account._id
                });
                await spell.save({ session });
                spellIds.push(spell._id);
            }

            for (const t of thData.troops ?? []) {
                const troop = new Troop({
                    name: t.name,
                    troopType: t.type || 'Elixir',
                    currentLevel: 0,
                    maxLevel: t.maxLevel,
                    status: 'Idle',
                    account: account._id
                });
                await troop.save({ session });
                troopIds.push(troop._id);
            }

            account.buildings = buildingIds;
            account.heroes = heroIds;
            account.pets = petIds;
            account.siege = siegeIds;
            account.spells = spellIds;
            account.troops = troopIds;

            const wallGroup = await createWallGroupForTownHall({ accountId: account._id, townHallLevel }, { session });
            if (wallGroup) {
                account.walls = wallGroup._id;
            }

            await account.save({ session });
            createdAccount = account;
        });

        if (!createdAccount) {
            throw new Error('Account creation failed to commit.');
        }
        return createdAccount;
    } finally {
        await session.endSession();
    }
}

export async function createAccountFromClashAPIService({ userId, username, playerTag, townHallLevel, clanTag, preferences, playerData }) {
    const session = await mongoose.startSession();
    try {
        let createdAccount = null;
        await session.withTransaction(async () => {
            if (playerTag) {
                const existingAccount = await Account.findOne({ playerTag }).session(session);
                if (existingAccount) {
                    const err = new Error('Player tag already exists.');
                    err.status = 404;
                    throw err;
                }
            }

            const thData = playerData;
            const itemsByTH = itemsByTownHall;
            if (!thData) {
                const err = new Error('Invalid Town Hall level configuration');
                err.status = 400;
                throw err;
            }

            const account = new Account({
                owner: userId,
                username,
                playerTag: playerTag || null,
                townHallLevel,
                clanTag: clanTag || null,
                lastActive: new Date(),
                totalUpgrades: 0,
                preferences: {
                    notifications: preferences?.notifications ?? true,
                    theme: preferences?.theme ?? 'light',
                    language: preferences?.language ?? 'en'
                },
                walls: null
            });

            const buildingIds = [];
            const heroIds = [];
            const troopIds = [];
            const petIds = [];
            const siegeIds = [];
            const spellIds = [];

            for (const trp of playerData.troops ?? []){
                switch (trp.unlockBuilding) {
                    case 'Barracks':
                        if (!trp.originalName){
                            const elixirTroop = new Troop({
                                name: trp.name,
                                troopType: 'Elixir',
                                currentLevel: trp.level ,
                                // itemsByTH[townHallLevel].troops.find(t => t.name === trp.name)?.maxLevel || 
                                maxLevel: itemsByTH[townHallLevel].troops.find(t => t.name === trp.name)?.maxLevel ||  trp.maxLevel,
                                status: 'Idle',
                                account: account._id,
                                upgradeCost: trp.upgradeCost,
                                upgradeTime: trp.upgradeTime,
                                housingSpace: trp.housingSpace
                            });
                            console.log(elixirTroop.name, elixirTroop.currentLevel, elixirTroop.maxLevel);
                            await elixirTroop.save({ session });
                            troopIds.push(elixirTroop._id);
                        }
                        break;
                    case 'Dark Barracks':
                        if (!trp.originalName){
                            const darkElixirTroop = new Troop({
                                name: trp.name,
                                troopType: 'Dark Elixir',
                                currentLevel: trp.level,
                                maxLevel: itemsByTH[townHallLevel].troops.find(t => t.name === trp.name)?.maxLevel || trp.maxLevel,
                                status: 'Idle',
                                account: account._id,
                                upgradeCost: trp.upgradeCost,
                                upgradeTime: trp.upgradeTime,
                                housingSpace: trp.housingSpace
                            });
                            await darkElixirTroop.save({ session });
                            troopIds.push(darkElixirTroop._id);
                        }
                        break;
                    case 'Workshop':
                        const sge = new Siege({
                            name: trp.name,
                            siegeType: trp.upgradeResource,
                            currentLevel: trp.level,
                            maxLevel: itemsByTH[townHallLevel].sieges.find(t => t.name === trp.name)?.maxLevel || trp.maxLevel,
                            status: 'Idle',
                            account: account._id,
                            upgradeCost: trp.upgradeCost,
                            upgradeTime: trp.upgradeTime,
                            housingSpace: trp.housingSpace
                        });
                        await sge.save({ session });
                        siegeIds.push(sge._id);
                        break;
                    case 'Pet House':
                        const pet = new Pet({
                            name: trp.name,
                            petType: trp.name,
                            currentLevel: trp.level,
                            maxLevel: itemsByTH[townHallLevel].pets.find(t => t.name === trp.name)?.maxLevel || trp.maxLevel,
                            status: 'Idle',
                            account: account._id,
                            upgradeCost: trp.upgradeCost,
                            upgradeTime: trp.upgradeTime,
                        });
                        await pet.save({ session });
                        petIds.push(pet._id);
                    default:
                        break;
                }
            }

            for (const b of thData.buildings ?? []) {
                for (let i = 0; i < (b.count ?? 0); i++) {
                    const building = new Building({
                        name: b.name,
                        buildingType: b.type || 'Special',
                        currentLevel: 0,
                        maxLevel: b.maxLevel,
                        status: 'Idle',
                        account: account._id
                    });
                    await building.save({ session });
                    buildingIds.push(building._id);
                }
            }

            for (const h of thData.heroes ?? []) {
                switch (h.village) {
                    case 'home':
                        const hero = new Hero({
                            name: h.name,
                            heroType: h.unlockResource || h.upgradeResource || h.name,
                            currentLevel: h.level,
                            maxLevel: itemsByTH[townHallLevel].heroes.find(t => t.name === h.name)?.maxLevel || h.maxLevel,
                            status: 'Idle',
                            account: account._id,
                            upgradeCost: h.upgradeCost,
                            upgradeTime: h.upgradeTime,
                        });
                        await hero.save({ session });
                        heroIds.push(hero._id);
                        break;
                    default:
                        break;
                }
                
            }

            for (const s of thData.spells ?? []) {
                const spell = new Spell({
                    name: s.name,
                    spellType: s.type || 'Elixir',
                    currentLevel: s.level,
                    maxLevel: itemsByTH[townHallLevel].spells.find(t => t.name === s.name)?.maxLevel || s.maxLevel,
                    status: 'Idle',
                    account: account._id,
                    upgradeTime: s.upgradeTime, 
                    upgradeCost: s.upgradeCost,
                    housingSpace: s.housingSpace,
                });
                await spell.save({ session });
                spellIds.push(spell._id);
            }

            account.buildings = buildingIds;
            account.heroes = heroIds;
            account.pets = petIds;
            account.siege = siegeIds;
            account.spells = spellIds;
            account.troops = troopIds;

            // const wallGroup = await createWallGroupForTownHall({ accountId: account._id, townHallLevel }, { session });
            // if (wallGroup) {
            //     account.walls = wallGroup._id;
            // }

            await account.save({ session });
            createdAccount = account;
        });

        if (!createdAccount) {
            throw new Error('Account creation failed to commit.');
        }
        return createdAccount;
    } finally {
        await session.endSession();
    }
}

export async function updateAccountDataFromPasteService(pastedData) {
    const buildingTypes = ['Army', 'Resource', 'Defense', 'Wall']
    const session = await mongoose.startSession();
    try {
        let updatedAccount = null;
        await session.withTransaction(async () => {
             
            const account =  await Account.findOne({ playerTag: pastedData.tag }).session(session);
            const buildingIds = [];
            const trapsIds = [];
            const wallPiecesByLevel = {};

            // console.log('is paste data recieved?', pastedData)

            for (const b of pastedData.buildings ?? []) {
                const id = Number(b.data ?? b._id ?? b['data'] ?? NaN);
                const staticEntry = static_data.buildings.find(s => s._id === id);
                const buildingName = staticEntry?.name ?? b.name ?? `Unknown (${id})`;
                const buildingType = staticEntry?.type ?? b.type ?? 'Special';
                const maxLevel = b.maxLevel ?? b.lvl ?? 0;
                const count = b.cnt ?? 1;

                if (id === 1000010) {
                    wallPiecesByLevel[b.lvl] = (wallPiecesByLevel[b.lvl] || 0) + count;
                    continue;
                }

                if( !buildingTypes.includes(buildingType) ) {
                    continue;
                }

                for (let i = 0; i < count; i++) {
                    const building = new Building({
                        name: buildingName,
                        buildingType: buildingType,
                        currentLevel: b.lvl,
                        maxLevel: maxLevel,
                        status: 'Idle',
                        account: account._id
                    });
                    console.log('building being created.')
                    await building.save({ session });
                    buildingIds.push(building._id);
                }
            }

            for (const trap of pastedData.traps ?? []) {
                const id = Number(trap.data ?? trap._id ?? trap['data'] ?? NaN);
                const staticEntry = static_data.traps.find((s) => s._id === id);
                const trapName = staticEntry?.name ?? trap.name ?? `Unknown Trap (${id})`;
                const trapType = staticEntry?.village === 'builderBase' ? 'Builder Trap' : 'Trap';
                const currentLevel = Number(trap.lvl ?? 0);
                const maxLevel = trap.maxLevel ?? currentLevel;
                const count = Number(trap.count ?? trap.cnt ?? 1) || 0;

                for (let i = 0; i < count; i++) {
                    const trapDoc = new Building({
                        name: trapName,
                        buildingType: trapType,
                        currentLevel,
                        maxLevel,
                        status: 'Idle',
                        account: account._id
                    });
                    console.log(trapDoc.name);
                    await trapDoc.save({ session });
                    buildingIds.push(trapDoc._id);
                }
            }

            account.buildings = buildingIds;
            const townHallLevel = account.townHallLevel;

            if (Object.keys(wallPiecesByLevel).length > 0) {
                const levels = Object.entries(wallPiecesByLevel)
                    .map(([lvl, cnt]) => ({ level: Number(lvl) || 1, count: cnt }))
                    .sort((a, b) => a.level - b.level);
                const maxLevel = levels.reduce((m, l) => Math.max(m, l.level), account.townHallLevel || 1);
                const wallGroup = await WallGroup.findOneAndUpdate(
                    { account: account._id },
                    { maxLevel, levels },
                    { session, upsert: true, new: true, setDefaultsOnInsert: true }
                );
                account.walls = wallGroup._id;
            }

            await account.save({ session });
            updatedAccount = account;


        });
        if (!updatedAccount) throw new Error('Account update failed to commit.');
        return updatedAccount;
    } finally {
        await session.endSession();
    }
}

export async function updateAccountService({ userId, id, username, playerTag, townHallLevel, clanTag, preferences }) {
    const account = await Account.findOne({ _id: id, owner: userId });

    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }
    
    if (username) {
        account.username = username;
    } 

    if (playerTag !== undefined) {
        // Check if playerTag already exists (if provided and different from current)
        if (playerTag && playerTag !== account.playerTag) {
            const existingAccount = await Account.findOne({ playerTag });
            if (existingAccount) {
                const err = new Error('Player tag already exists');
                err.status = 400;
                throw err;
            }
        }
            account.playerTag = playerTag;
    }

    if (townHallLevel !== undefined) {
        if (!Number.isInteger(townHallLevel) || townHallLevel < 2 || townHallLevel > maxTownHallLevel) {
            const err = new Error('Invalid town hall level');
            err.status = 400;
            throw err;
        }
        if (townHallLevel !== account.townHallLevel) {
            const err = new Error('Changing Town Hall level is not supported yet.');
            err.status = 400;
            throw err;
        }
    }

    if (clanTag !== undefined) {
        account.clanTag = clanTag;
    }

    if (preferences) {
        account.preferences = {
            ...account.preferences,
            ...preferences
        };
    }

    account.lastActive = new Date();
    await account.save();
}

export async function deleteAccountService(userId, accountId) {
    const account = await Account.findOne({ _id: accountId, owner: userId });

    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }

    const [ buildingRes,heroRes, petRes, siegeRes, spellRes, troopRes ] = await Promise.all([
        Building.deleteMany({ account: accountId }),
        Hero.deleteMany({ account: accountId }),
        Pet.deleteMany({ account: accountId }),
        Siege.deleteMany({ account: accountId }),
        Spell.deleteMany({ account: accountId }),
        Troop.deleteMany({ account: accountId }),
    ]);

    // Remove walls group if exists
    await WallGroup.deleteOne({ account: accountId });

    await Account.findByIdAndDelete(accountId);

    return {
        deleted: true,
        accountId,
        removed: {
            buildings: buildingRes.deletedCount || 0,
            heroes: heroRes.deletedCount || 0,
            pets: petRes.deletedCount || 0,
            sieges: siegeRes.deletedCount || 0,
            spells: spellRes.deletedCount || 0,
            troops: troopRes.deletedCount || 0,
        }
    };
}

export async function getAccountStatsService(userId, accountId) {
    const account = await Account.findOne({ _id: accountId, owner: userId });
    if (!account) {
        const err = new Error('Account not found');
        err.status = 404;
        throw err;
    }

    const wallGroup = await ensureAccountWallGroup(account);
    if (account.isModified('walls')) {
        await account.save();
    }

    const wallStats = buildWallStats(wallGroup);

    const [ buildingStats, heroStats, troopStats, petStats, siegeStats, spellStats ] = await Promise.all([
        Building.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Hero.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Troop.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Pet.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Siege.aggregate([
            { $match: { account: account._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ]),
        Spell.aggregate([
            { $match: { account: account._id } }, 
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    maxed: { $sum: { $cond: [{ $eq: ['$currentLevel', '$maxLevel'] }, 1, 0] } },
                    upgrading: { $sum: { $cond: [{ $eq: ['$status', 'Upgrading'] }, 1, 0] } }
                }
            }
        ])
    ]);

    return {
        account: {
            username: account.username,
            townHallLevel: account.townHallLevel,
            clanTag: account.clanTag,
            lastActive: account.lastActive,
            totalUpgrades: account.totalUpgrades,
            preferences: account.preferences
        },
        buildings: buildingStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        heroes: heroStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        troops: troopStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        pets: petStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        sieges: siegeStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        spells: spellStats[0] || { total: 0, maxed: 0, upgrading: 0 },
        walls: wallStats
    };
}

export async function getAccountsByClanService({ userId, clanTag, sortBy }) {
    if (!clanTag) throw { status: 400, message: 'clanTag is required' };

    let accounts = await Account.find({ clanTag, owner: userId });

    if (sortBy) {
        switch (sortBy) {
            case 'username':
                accounts.sort((a, b) => a.username.localeCompare(b.username));
                break;
            case 'townHallLevel':
                accounts.sort((a, b) => b.townHallLevel - a.townHallLevel);
                break;
            case 'lastActive':
                accounts.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                break;
            case 'totalUpgrades':
                accounts.sort((a, b) => b.totalUpgrades - a.totalUpgrades);
                break;
            default:
                break;
        }
    }
    return accounts;
}

export async function updateAccountPreferencesService({ userId, accountId, preferences }) {
    if (!preferences || typeof preferences !== 'object') {
        throw { status: 400, message: 'preferences object is required' };
    }

    const account = await Account.findOne({ _id: accountId, owner: userId });
    if (!account) throw { status: 404, message: 'Account not found' };

    account.preferences = {
        ...account.preferences,
        ...preferences
    };
    account.lastActive = new Date();
    await account.save();

    return account.preferences;
}

export async function getAccountByPlayerTagService(userId, playerTag) {
    if (!playerTag) throw { status: 400, message: 'playerTag is required' };

    const account = await Account.findOne({ playerTag, owner: userId })
        .populate('buildings')
        .populate('heroes')
        .populate('pets')
        .populate('siege')
        .populate('spells')
        .populate('troops')
        .populate('walls')

    if (!account) throw { status: 404, message: 'Account not found' };

    account.lastActive = new Date();
    await account.save();

    // try {
    //     const serializedAccount = account.toObject({ virtuals: true });
    //     await fs.writeFile(filePath, JSON.stringify(serializedAccount, null, 2), 'utf-8');
    // } catch (writeError) {
    //     console.error('Failed to persist account detail snapshot', writeError);
    // }
    const accountProgress = calculateAccountProgress(account);
    account.set('progress', accountProgress, { strict: false});

    return account;
}

export async function searchAccountsService({ userId, q, type, limit = 20 }) {
    if (!q) throw { status: 400, message: 'Search query is required' };

    const regex = { $regex: q, $options: 'i' };
    let query = { owner: userId };

    if (type === 'playerTag') {
    query.playerTag = regex;
    } else if (type === 'username') {
    query.username = regex;
    } else {
        query.$or = [
            { username: regex },
            { playerTag: regex }
        ];
    }

    const accounts = await Account.find(query)
        .select('username playerTag townHallLevel clanTag lastActive totalUpgrades')
        .limit(limit);

    return accounts;
}

async function ensureAccountWallGroup(account) {
    if (!account) return null;

    let wallGroup = null;

    if (account.walls) {
        wallGroup = await WallGroup.findById(account.walls);
    }

    if (!wallGroup) {
        wallGroup = await createWallGroupForTownHall({
            accountId: account._id,
            townHallLevel: account.townHallLevel
        });

        if (wallGroup) {
            account.walls = wallGroup._id;
        }
    }

    return wallGroup;
}

function buildWallStats(wallGroup) {
    const data = wallGroup?.toObject?.() ?? wallGroup ?? null;

    if (!data) {
        return {
            total: 0,
            maxed: 0,
            maxLevel: 0,
            perLevel: []
        };
    }

    const segments = data.segments ?? data.levels ?? [];
    const baseLevel = data.maxLevel ?? data.currentLevel ?? 0;
    const total = segments.reduce((sum, seg) => sum + (seg?.count ?? 0), 0);
    const maxLevel = segments.reduce(
        (max, seg) => Math.max(max, seg?.level ?? seg?.currentLevel ?? max),
        baseLevel
    );
    const maxed = segments.reduce((sum, seg) => {
        const level = seg?.level ?? seg?.currentLevel ?? 0;
        return level >= maxLevel ? sum + (seg?.count ?? 0) : sum;
    }, 0);
    const perLevel = segments
        .map(seg => ({
            level: seg?.level ?? seg?.currentLevel ?? 0,
            count: seg?.count ?? 0
        }))
        .sort((a, b) => a.level - b.level);

    return { total, maxed, maxLevel, perLevel };
}

function calculateAccountProgress(accountData = {}) {
    const sumLevels = (items = []) =>
        items.reduce(
            (acc, item) => {
                acc.current += Number(item.currentLevel ?? item.level ?? 0);
                acc.max += Number(item.maxLevel ?? item.level ?? 0);
                return acc;
            },
            { current: 0, max: 0 }
        );

    const buildings = sumLevels(accountData.buildings);
    const heroes = sumLevels(accountData.heroes);
    const troops = sumLevels(accountData.troops);
    const pets = sumLevels(accountData.pets);
    const sieges = sumLevels(accountData.siege);
    const spells = sumLevels(accountData.spells);

    const walls = (() => {
        const segments = accountData.walls?.levels ?? accountData.walls?.segments ?? [];
        const totals = segments.reduce(
            (acc, seg) => {
                const level = Number(seg.level ?? seg.currentLevel ?? 0);
                const count = Number(seg.count ?? 0);
                acc.current += level * count;
                acc.count += count;
                return acc;
            },
            { current: 0, count: 0 }
        );
        const maxLevel = Number(accountData.walls?.maxLevel ?? 0);
        const denom = maxLevel * totals.count;
        return {
            current: totals.current,
            max: denom,
            percentage: denom ? Math.floor((totals.current / denom) * 100) : 0
        };
    })();

    const toPercent = ({ current, max }) => (max ? (current / max) * 100 : 0);

    // console.log({
    //     buildings: { ...buildings, percentage: toPercent(buildings) },
    //     heroes: { ...heroes, percentage: toPercent(heroes) },
    //     troops: { ...troops, percentage: toPercent(troops) },
    //     pets: { ...pets, percentage: toPercent(pets) },
    //     sieges: { ...sieges, percentage: toPercent(sieges) },
    //     spells: { ...spells, percentage: toPercent(spells) },
    //     walls
    // })

    return {
        buildings: { ...buildings, percentage: Math.floor(toPercent(buildings)) },
        heroes: { ...heroes, percentage: Math.floor(toPercent(heroes)) },
        troops: { ...troops, percentage: Math.floor(toPercent(troops)) },
        pets: { ...pets, percentage: Math.floor(toPercent(pets)) },
        sieges: { ...sieges, percentage: Math.floor(toPercent(sieges)) },
        spells: { ...spells, percentage: Math.floor(toPercent(spells)) },
        walls
    };
}