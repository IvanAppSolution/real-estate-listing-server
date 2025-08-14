// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')
import connectDB from './configs/db'
import 'dotenv/config'
import userRouter from './routes/userRoute'
import listRouter from './routes/listRoute'
import connectCloudinary from './configs/cloudinary'

const app = express()
const port: number = parseInt(process.env.PORT || '4000')

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
        const allowedOrigins = [
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean)
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.log(`Blocked by CORS: ${origin}`)
            callback(null, true) // Allow for now
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

// For Vercel serverless deployment
if (process.env.VERCEL) {
    module.exports = async (req: any, res: any) => {
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
} else {
    // For local development
    ;(async () => {
        await initializeServices()
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`)
            console.log(`📍 API available at: http://localhost:${port}/api`)
            console.log(`🏥 Health check: http://localhost:${port}/health`)
        })
    })()
}
