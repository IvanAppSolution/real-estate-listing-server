"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myListings = exports.deleteList = exports.mediaUpload = exports.updateList = exports.listById = exports.lists = exports.addList = void 0;
const cloudinary = require('cloudinary').v2;
const List_1 = __importDefault(require("../models/List"));
const addList = async (req, res) => {
    try {
        const { listData } = req.body;
        if (!listData) {
            res.json({ success: false, message: "List data is required" });
            return;
        }
        const data = JSON.parse(listData);
        data.userId = req.userId || req.body.userId;
        const response = await List_1.default.create({ ...data });
        res.json({ success: true, id: response.id, message: "List Added" });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.addList = addList;
const lists = async (req, res) => {
    try {
        const data = await List_1.default.find({});
        res.json({ success: true, data });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.lists = lists;
const listById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await List_1.default.findById(id);
        res.json({ success: true, data });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.listById = listById;
const updateList = async (req, res) => {
    try {
        let { id, listData } = req.body;
        if (!id || !listData) {
            res.json({ success: false, message: "ID and list data are required" });
            return;
        }
        const parsedId = JSON.parse(id);
        const parsedListData = JSON.parse(listData);
        await List_1.default.findByIdAndUpdate(parsedId, { ...parsedListData });
        res.json({ success: true, message: "List Updated" });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.updateList = updateList;
const mediaUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            res.json({ success: false, message: "No files uploaded" });
            return;
        }
        const images = req.files;
        const imagesUrl = await Promise.all(images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
        }));
        res.json({ success: true, data: imagesUrl });
    }
    catch (error) {
        console.error("Error uploading files:", error);
        res.json({ success: false, message: error.message });
    }
};
exports.mediaUpload = mediaUpload;
const deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.json({ success: false, message: "ID is required" });
            return;
        }
        const deletedList = await List_1.default.findByIdAndDelete(id);
        if (!deletedList) {
            res.json({ success: false, message: "List not found" });
            return;
        }
        res.json({ success: true, message: "List deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting list:", error);
        res.json({ success: false, message: error.message });
    }
};
exports.deleteList = deleteList;
const myListings = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            res.json({ success: false, message: "User ID is required" });
            return;
        }
        const listings = await List_1.default.find({ userId });
        if (!listings || listings.length === 0) {
            res.json({ success: false, message: "No listings found for this user" });
            return;
        }
        res.json({ success: true, data: listings });
    }
    catch (error) {
        console.error("Error fetching user listings:", error);
        res.json({ success: false, message: error.message });
    }
};
exports.myListings = myListings;
//# sourceMappingURL=listController.js.map