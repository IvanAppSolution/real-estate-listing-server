import cookieParser from 'cookie-parser'
import express, { Request, Response } from 'express'
import cors from 'cors'
import connectDB from './configs/db'
import 'dotenv/config'
import userRouter from './routes/userRoute'
import listRouter from './routes/listRoute'
import connectCloudinary from './configs/cloudinary'

const app = express()
const port: number = 4000;

(async () => {
    await connectDB()
    await connectCloudinary()
})()

// Allow multiple origins
const allowedOrigins: string[] = [] // ['http://localhost:3000', '']

// Middleware configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use('/api/user', userRouter)
app.use('/api/list', listRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
