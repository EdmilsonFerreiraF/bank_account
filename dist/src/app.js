"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const accountRouter_1 = require("./controller/routes/accountRouter");
require("dotenv/config");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(accountRouter_1.accountRouter);
app.use((err, _, res, __) => {
    if (err instanceof Error) {
        return res.status(400).json({
            message: err.message
        });
    }
    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err}`
    });
});
//# sourceMappingURL=app.js.map