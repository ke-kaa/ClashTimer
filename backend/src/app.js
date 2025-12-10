import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import apiRouter from './routes/index.js';
import { config } from './config/config.js';

// import package.json versoin safely
let pkg;
try {
    const mod = await import('../package.json', { assert: { type: 'json' } });
    pkg = mod.default;
} catch {
    pkg = { version: '0.0.0' };
}

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { porelicy: "cross-origin" } }));

const corsOptions = config.corsOrigin === '*'
    ? { origin: '*' }
    : { origin: config.corsOrigin, credentials: true };
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.env !== 'test') app.use(morgan('dev'));

// Health & Meta
app.get('/api/health', async (_req, res) => {
    res.json({
        status: 'ok',
        app: config.appName,
        env: config.env,
        version: (await pkg).version,
        time: new Date().toISOString()
    });
});

// API Routes
app.use('/api', apiRouter);

// 404
app.use((req, res, _next) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Central Error Handler
// Throw either Error with err.status or { status, message }
app.use((err, _req, res, _next) => {
    const status = err?.status || 500;
    const message = err?.message || err?.error || 'Internal Server Error';
    if (config.env !== 'test') {
        console.error('[Error]', {
        status,
        message,
        stack: err?.stack
        });
    }
    res.status(status).json({ error: message });
});

export default app;