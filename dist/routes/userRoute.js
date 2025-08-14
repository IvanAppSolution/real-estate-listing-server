"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const userController_1 = require("../controllers/userController");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const userRouter = express.Router();
userRouter.post('/register', userController_1.register);
userRouter.post('/login', userController_1.login);
userRouter.get('/is-auth', authUser_1.default, userController_1.isAuth);
userRouter.get('/profile', authUser_1.default, userController_1.getProfile);
userRouter.get('/logout', authUser_1.default, userController_1.logout);
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map