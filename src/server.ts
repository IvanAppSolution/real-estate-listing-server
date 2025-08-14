import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db'
import 'dotenv/config'
import userRouter from './routes/userRoute'
import listRouter from './routes/listRoute'
import connectCloudinary from './configs/cloudinary'

const app = express()
const port: number = Number(process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.LOCAL_PORT);

(async () => {
    await connectDB()
    await connectCloudinary()
})()

// Allow multiple origins
const allowedOrigins: string[] = [process.env.NODE_ENV === 'production' ? process.env.FRONTEND_PROD_URL! : process.env.FRONTEND_LOCAL_URL!]

// Middleware configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use('/api/user', userRouter)
app.use('/api/list', listRouter)

app.listen(port, () => {
    console.log(`Server is running`)
})
