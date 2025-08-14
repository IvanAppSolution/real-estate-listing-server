import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db'
import 'dotenv/config'
import userRouter from './routes/userRoute'
import listRouter from './routes/listRoute'
import connectCloudinary from './configs/cloudinary'
import { Request, Response } from 'express'

const app = express()
const port: number = Number(process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.LOCAL_PORT);

(async () => {
    await connectDB()
    await connectCloudinary()
})()

// Allow multiple origins
const allowedOrigins: string[] = []

if (process.env.NODE_ENV === 'production') {
    // Production origins
    if (process.env.FRONTEND_PROD_URL) {
        allowedOrigins.push(process.env.FRONTEND_PROD_URL)
    }
    // Add any additional production domains
    allowedOrigins.push('https://yourdomain.com', 'https://www.yourdomain.com')
} else {
    // Development origins
    allowedOrigins.push(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4173', // Vite preview port
        'http://127.0.0.1:4173'
    )
    
    // Add environment variable if set
    if (process.env.FRONTEND_LOCAL_URL) {
        allowedOrigins.push(process.env.FRONTEND_LOCAL_URL)
    }
}

// CORS configuration
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(`Blocked by CORS: ${origin}`)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/api/user', userRouter)
app.use('/api/list', listRouter)
app.use('/api', (req: Request, res: Response) => {
    res.send('API is working')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
