"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const multer_1 = require("../configs/multer");
const listController_1 = require("../controllers/listController");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const listRouter = express.Router();
listRouter.get('', listController_1.lists);
listRouter.get('/myListings', authUser_1.default, listController_1.myListings);
listRouter.get('/:id', listController_1.listById);
listRouter.post('/add', multer_1.upload.none(), authUser_1.default, listController_1.addList);
listRouter.post('/update', multer_1.upload.none(), authUser_1.default, listController_1.updateList);
listRouter.post('/media/upload', multer_1.upload.array('images'), authUser_1.default, listController_1.mediaUpload);
listRouter.delete('/:id', authUser_1.default, listController_1.deleteList);
exports.default = listRouter;
//# sourceMappingURL=listRoute.js.map