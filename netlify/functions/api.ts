import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serverless = require('serverless-http')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')

// Import your modules (adjust paths as needed)
import connectDB from '../../src/configs/db'
import userRouter from '../../src/routes/userRoute'
import listRouter from '../../src/routes/listRoute'
import connectCloudinary from '../../src/configs/cloudinary'

const app = express()

// Cache connections to avoid reconnecting on every request
let isConnected = false

const initializeServices = async () => {
    if (!isConnected) {
        try {
            await connectDB()
            await connectCloudinary()
            isConnected = true
            console.log('Services initialized successfully')
        } catch (error) {
            console.error('Failed to initialize services:', error)
            throw error
        }
    }
}

// CORS configuration
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow all origins for Netlify (you can restrict this later)
        callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(cors(corsOptions))

// Routes - Note: Netlify functions run under /.netlify/functions/api
app.use('/.netlify/functions/api/user', userRouter)
app.use('/.netlify/functions/api/list', listRouter)

// Health check
app.get('/.netlify/functions/api/health', (req: any, res: any) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        platform: 'Netlify'
    })
})

// Root API endpoint
app.get('/.netlify/functions/api', (req: any, res: any) => {
    res.json({ 
        message: 'Real Estate API is working on Netlify!', 
        timestamp: new Date().toISOString(),
        endpoints: [
            '/.netlify/functions/api/health',
            '/.netlify/functions/api/user',
            '/.netlify/functions/api/list'
        ]
    })
})

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err)
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV !== 'production' ? err.message : undefined
    })
})

// Initialize services before handling requests
const handler = serverless(app)

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        await initializeServices()
        return await handler(event, context)
    } catch (error) {
        console.error('Netlify function error:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                message: 'Failed to initialize server',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}