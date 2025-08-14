const express = require('express')
import { login, logout, register, getProfile, isAuth } from '../controllers/userController'
import authUser from '../middlewares/authUser'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/profile', authUser, getProfile)
userRouter.get('/logout', authUser, logout)

export default userRouter
