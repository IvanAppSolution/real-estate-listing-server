const express = require('express')
import { register,getProfile, pong } from '../controllers/userController'
import authUser from '../middlewares/authUser'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.get('/profile', authUser, getProfile)
userRouter.get('/ping', pong)

export default userRouter
