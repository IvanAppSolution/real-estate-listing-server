"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const authUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        if (!token) {
            res.json({ success: false, message: 'Not Authorized - No token provided' });
            return;
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            req.userId = tokenDecode.id;
        }
        else {
            res.json({ success: false, message: 'Not Authorized - Invalid token' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.json({ success: false, message: 'Not Authorized - Token verification failed' });
    }
};
exports.default = authUser;
//# sourceMappingURL=authUser.js.map