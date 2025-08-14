import User from '../models/User'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken')

interface AuthRequest {
    userId?: string
    body: any
}

interface RegisterRequest {
    body: {
        username: string
        email: string
        password: string
    }
}

interface LoginRequest {
    body: {
        email: string
        password: string
    }
}

// Register User : /api/user/register
export const register = async (req: any, res: any): Promise<void> => {
    try {
        const { username, email, password } = req.body        
        
        if (!username || !email || !password) {
            res.json({ success: false, message: 'Missing Details' })
            return
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            res.json({ success: false, message: 'User already exists' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ username, email, password: hashedPassword })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

        // For development, still set cookie for backward compatibility
        // But mainly return token in response for frontend to store
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        res.json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username },
            token,
            message: "Registration successful"
        })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Login User : /api/user/login
export const login = async (req: any, res: any): Promise<void> => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            res.json({ success: false, message: 'Email and password are required' })
            return
        }
        
        const user = await User.findOne({ email })

        if (!user) {
            res.json({ success: false, message: 'Invalid email or password' })
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.json({ success: false, message: 'Invalid email or password' })
            return
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

        // Set cookie for backward compatibility
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username },
            token,
            message: "Login successful"
        })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Check Auth : /api/user/is-auth
export const isAuth = async (req: any, res: any): Promise<void> => {
    try {
        const userId = req.userId || req.body.userId
        const user = await User.findById(userId).select("-password")
        res.json({ success: true, user })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Get User Profile : /api/user/profile
export const getProfile = async (req: any, res: any): Promise<void> => {
    try {
        const userId = req.userId || req.body.userId
        const user = await User.findById(userId).select("-password")

        if (!user) {
            res.json({ success: false, message: "User not found" })
            return
        }

        res.json({ success: true, user })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Logout User : /api/user/logout
export const logout = async (req: any, res: any): Promise<void> => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

export const pong = async (req: any, res: any): Promise<void> => {
    try {
        res.json({ success: true, message: "Pong" })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

