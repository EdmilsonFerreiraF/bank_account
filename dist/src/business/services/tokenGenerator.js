"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGenerator = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv_1.default.config();
class TokenGenerator {
    constructor() {
        this.generate = (input) => {
            const newToken = jwt.sign({
                id: input.id,
                cpf: input.cpf,
            }, process.env.JWT_KEY, {
                expiresIn: TokenGenerator.expiresIn,
            });
            return newToken;
        };
    }
    verify(token) {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const result = { id: payload.id, cpf: payload.cpf };
        return result;
    }
}
exports.TokenGenerator = TokenGenerator;
TokenGenerator.expiresIn = Number(process.env.ACCESS_TOKEN_EXPIRES_IN);
exports.default = new TokenGenerator();
//# sourceMappingURL=tokenGenerator.js.map