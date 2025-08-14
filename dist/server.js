"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./configs/db"));
require("dotenv/config");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const listRoute_1 = __importDefault(require("./routes/listRoute"));
const cloudinary_1 = __importDefault(require("./configs/cloudinary"));
const app = (0, express_1.default)();
const port = 4000;
(async () => {
    await (0, db_1.default)();
    await (0, cloudinary_1.default)();
})();
const allowedOrigins = [];
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
app.use('/api/user', userRoute_1.default);
app.use('/api/list', listRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map