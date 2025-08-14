// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken')

interface AuthRequest {
    userId?: string
    token?: string
    body: any
    headers: any
}

interface JwtPayload {
    id: string
}

const authUser = async (req: any, res: any, next: any): Promise<void> => {
    try {
        let token = req.headers.authorization

        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7)
        }

        if (!token) {
            res.json({ success: false, message: 'Not Authorized - No token provided' })
            return
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
            req.userId = tokenDecode.id // Also add to req for easier access
        } else {
            res.json({ success: false, message: 'Not Authorized - Invalid token' })
            return
        }

        next()

    } catch (error) {
        console.error('Auth middleware error:', error)
        res.json({ success: false, message: 'Not Authorized - Token verification failed' })
    }
}

export default authUser
