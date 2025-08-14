"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pong = exports.logout = exports.getProfile = exports.isAuth = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.json({ success: false, message: 'Missing Details' });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.json({ success: false, message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User_1.default.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username },
            token,
            message: "Registration successful"
        });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({ success: false, message: 'Email and password are required' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username },
            token,
            message: "Login successful"
        });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.login = login;
const isAuth = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await User_1.default.findById(userId).select("-password");
        res.json({ success: true, user });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.isAuth = isAuth;
const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await User_1.default.findById(userId).select("-password");
        if (!user) {
            res.json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.getProfile = getProfile;
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.json({ success: true, message: "Logged Out" });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.logout = logout;
const pong = async (req, res) => {
    try {
        res.json({ success: true, message: "Pong" });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.pong = pong;
//# sourceMappingURL=userController.js.map