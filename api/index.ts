import { VercelRequest, VercelResponse } from '@vercel/node'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser')
import userRouter from '../src/routes/userRoute'
import listRouter from '../src/routes/listRoute'
import connectDB from '../src/configs/db'
import connectCloudinary from '../src/configs/cloudinary'

const app = express()

// Initialize connections (only once)
let isConnected = false
const initializeConnections = async () => {
    if (!isConnected) {
        try {
            await connectDB()
            await connectCloudinary()
            isConnected = true
            console.log('Connections initialized')
        } catch (error) {
            console.error('Connection error:', error)
        }
    }
}

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://real-estate-listing-proj.netlify.app'
    ],
    credentials: true
}))

// Routes - Remove the /api prefix since Vercel handles that
app.use('/user', userRouter)
app.use('/list', listRouter)

app.get('/', (req: any, res: any) => {
    res.json({ message: 'API is working on Vercel', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
})

export default async (req: VercelRequest, res: VercelResponse) => {
    await initializeConnections()
    
    // Handle the request
    app(req, res)
}