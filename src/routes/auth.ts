const express = require('express')
import { login } from '../controllers/authController'
  
const authRouter = express.Router()

authRouter.post('/login', login)

export default authRouter
