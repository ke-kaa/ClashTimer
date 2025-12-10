import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/config.js';
import {initClashClient} from './services/external/cocClient.js'


let server;

async function connectDatabase() {
    if (mongoose.connection.readyState === 1) return;
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db.uri, {
        autoIndex: config.env !== 'production'
    });
    console.log(`[DB] Connected → ${config.db.uri}`);
}

async function start() {
    try {
        await connectDatabase();
        await initClashClient();
        server = http.createServer(app);
        server.listen(config.port, () => {
            console.log(`[Server] Listening on port ${config.port} (${config.env})`);
        });

        server.on('error', (err) => {
            console.error('[Server] Error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('[Startup] Failed:', err);
        process.exit(1);
    }
}

async function shutdown(signal) {
    console.log(`[Shutdown] Received ${signal}`);
    try {
        if (server) {
            await new Promise(resolve => server.close(resolve));
            console.log('[Shutdown] HTTP server closed');
        }

        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('[Shutdown] MongoDB connection closed');
        }
    } catch (e) {
        console.error('[Shutdown] Error:', e);
    } finally {
        process.exit(0);
    }
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
    console.error('[UnhandledRejection]', reason);
    shutdown('unhandledRejection');
});
process.on('uncaughtException', (err) => {
    console.error('[UncaughtException]', err);
    shutdown('uncaughtException');
});

start();

export { start, shutdown };