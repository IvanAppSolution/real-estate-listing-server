import User from '../models/User'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken')

interface AuthRequest {
    userId?: string
    body: any
}

interface LoginRequest {
    body: {
        email: string
        password: string
    }
}


// Login User : /api/auth/login
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
            user: { id: user.id, email: user.email, username: user.username, role: user?.role },
            token,
            message: "Login successful"
        })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}
 