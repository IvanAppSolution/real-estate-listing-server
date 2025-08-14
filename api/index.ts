import { VercelRequest, VercelResponse } from '@vercel/node'
// Import from dist for production, src for development
const connectDB = require(process.env.NODE_ENV === 'production' ? '../dist/configs/db' : '../src/configs/db')
const userRouter = require(process.env.NODE_ENV === 'production' ? '../dist/routes/userRoute' : '../src/routes/userRoute')
const listRouter = require(process.env.NODE_ENV === 'production' ? '../dist/routes/listRoute' : '../src/routes/listRoute')
const connectCloudinary = require(process.env.NODE_ENV === 'production' ? '../dist/configs/cloudinary' : '../src/configs/cloudinary')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')

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
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true)
        
        const allowedOrigins = [
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean)
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.log(`Blocked by CORS: ${origin}`)
            callback(null, true) // Allow for now, you can change this to false for stricter CORS
        }
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

// Routes
app.use('/api/user', userRouter)
app.use('/api/list', listRouter)

// Health check
app.get('/api/health', (req: any, res: any) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Root API endpoint
app.get('/api', (req: any, res: any) => {
    res.json({ 
        message: 'Real Estate API is working on Vercel!', 
        timestamp: new Date().toISOString() 
    })
})

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err)
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && { error: err.message })
    })
})

// 404 handler
app.use((req: any, res: any) => {
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.originalUrl} not found` 
    })
})

// Export the serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        await initializeServices()
        return app(req, res)
    } catch (error) {
        console.error('Serverless function error:', error)
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to initialize server' 
        })
    }
}