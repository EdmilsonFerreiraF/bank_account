"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const AccountBusiness_1 = require("../business/AccountBusiness");
const AccountsRepository_1 = require("../database/prisma/AccountsRepository");
const idGenerator_1 = require("../business/services/idGenerator");
const tokenGenerator_1 = require("../business/services/tokenGenerator");
const accountBusiness = new AccountBusiness_1.AccountBusiness(new idGenerator_1.IdGenerator(), new AccountsRepository_1.AccountsRepository(), new tokenGenerator_1.TokenGenerator());
class AccountController {
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, cpf } = req.body;
                const input = {
                    name,
                    cpf
                };
                const token = yield accountBusiness.createAccount(input);
                res.status(200).send({ token });
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    transferToAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cpf, money } = req.body;
                const input = {
                    cpf,
                    money
                };
                const token = req.headers.authorization;
                const account = yield accountBusiness.transferToAccount(input, token);
                res.status(200).send({ account });
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    depositToAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { money } = req.body;
                const input = {
                    money
                };
                const token = req.headers.authorization;
                const account = yield accountBusiness.depositToAccount(input, token);
                res.status(200).send({ account });
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
}
exports.AccountController = AccountController;
exports.default = new AccountController();
//# sourceMappingURL=AccountController.js.map