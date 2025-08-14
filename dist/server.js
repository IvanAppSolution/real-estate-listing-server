"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db_1 = __importDefault(require("./configs/db"));
require("dotenv/config");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const listRoute_1 = __importDefault(require("./routes/listRoute"));
const cloudinary_1 = __importDefault(require("./configs/cloudinary"));
const app = express();
const port = parseInt(process.env.PORT || '4000');
let isConnected = false;
const initializeServices = async () => {
    if (!isConnected) {
        try {
            await (0, db_1.default)();
            await (0, cloudinary_1.default)();
            isConnected = true;
            console.log('Services initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize services:', error);
            throw error;
        }
    }
};
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log(`Blocked by CORS: ${origin}`);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/user', userRoute_1.default);
app.use('/api/list', listRoute_1.default);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'Real Estate API is working on Vercel!',
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && { error: err.message })
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
if (process.env.VERCEL) {
    module.exports = async (req, res) => {
        try {
            await initializeServices();
            return app(req, res);
        }
        catch (error) {
            console.error('Serverless function error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to initialize server'
            });
        }
    };
}
else {
    ;
    (async () => {
        await initializeServices();
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
            console.log(`📍 API available at: http://localhost:${port}/api`);
            console.log(`🏥 Health check: http://localhost:${port}/health`);
        });
    })();
}
//# sourceMappingURL=server.js.map