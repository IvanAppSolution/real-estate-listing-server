"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    }
    catch (error) {
        console.error(error.message);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map