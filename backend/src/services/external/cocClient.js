import { Client } from 'clashofclans.js';
import { config } from '../../config/config.js';
const client = new Client();

export async function initClashClient() {
    try {
        await client.login({
            email: config.clash.email,
            password: config.clash.password,
            keyName: config.clash.keyName,
        });
        console.log('Clash of Clans API client logged in successfully.');
    } catch (err) {
        console.error('Failed to login to Clash of Clans API:', err);
        process.exit(1);
    }
}

export default client;
