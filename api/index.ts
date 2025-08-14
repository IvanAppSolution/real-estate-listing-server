import { VercelRequest, VercelResponse } from '@vercel/node'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')
import userRouter from '../src/routes/userRoute'
import listRouter from '../src/routes/listRoute'
import connectDB from '../src/configs/db'
import connectCloudinary from '../src/configs/cloudinary'

const app = express()

// Initialize connections (only once)
let isConnected = false
const initializeConnections = async () => {
    if (!isConnected) {
        await connectDB()
        await connectCloudinary()
        isConnected = true
    }
}

// Middleware
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))

// Routes
app.use('/api/user', userRouter)
app.use('/api/list', listRouter)

app.get('/api', (req: any, res: any) => {
    res.json({ message: 'API is working on Vercel' })
})

export default async (req: VercelRequest, res: VercelResponse) => {
    await initializeConnections()
    return app(req, res)
}