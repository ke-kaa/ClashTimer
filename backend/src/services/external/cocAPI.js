import fs from 'fs/promises';
import path from 'path';
import client from './cocClient.js';

const filePath = path.resolve(process.cwd(), 'data.json');

export default async function getPlayer(playerTag) {
    const player = await client.getPlayer(playerTag);
    // await fs.writeFile(filePath, JSON.stringify(player, null, 2), 'utf8');
    return player;
}