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
exports.AccountBusiness = void 0;
const AccountsRepository_1 = require("../database/prisma/AccountsRepository");
const Account_1 = require("../database/model/Account");
const CustomError_1 = require("../errors/CustomError");
const idGenerator_1 = require("./services/idGenerator");
const tokenGenerator_1 = require("./services/tokenGenerator");
class AccountBusiness {
    constructor(idGenerator, accountsRepository, tokenGenerator) {
        this.idGenerator = idGenerator;
        this.accountsRepository = accountsRepository;
        this.tokenGenerator = tokenGenerator;
    }
    createAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.name ||
                    !input.cpf) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (input.cpf.length !== 11) {
                    throw new CustomError_1.CustomError(417, "CPF must be 11 characters length");
                }
                const id = this.idGenerator.generate();
                yield this.accountsRepository.createAccount(new Account_1.Account(id, input.name, input.cpf));
                const token = this.tokenGenerator.generate({
                    id,
                    cpf: input.cpf,
                });
                return token;
            }
            catch (error) {
                if (error.message.includes('Unique constraint failed on the fields: (`cpf`)')) {
                    throw new CustomError_1.CustomError(409, "Account already exists");
                }
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    transferToAccount(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.cpf ||
                    !input.money && input.money !== 0) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(417, "Missing token");
                }
                if (input.cpf.length !== 11) {
                    throw new CustomError_1.CustomError(417, "CPF must be 11 characters length");
                }
                if (input.money <= 0) {
                    throw new CustomError_1.CustomError(417, "Money value must be greater than zero");
                }
                let bearer;
                let tokenString;
                if (token.includes('Bearer ')) {
                    [bearer, tokenString] = token.split('Bearer ');
                }
                else {
                    tokenString = token;
                }
                const tokenData = this.tokenGenerator.verify(tokenString);
                if (input.cpf === tokenData.cpf) {
                    throw new CustomError_1.CustomError(403, "Cannot transfer to your own account");
                }
                const account = yield this.accountsRepository.getAccount(input, tokenData);
                if (!account) {
                    throw new CustomError_1.CustomError(404, "Could not find receiver's account");
                }
                if (account.getBalance() - input.money < 0) {
                    throw new CustomError_1.CustomError(403, "Not enough money. Can't transfer a value above your money");
                }
                const updatedAccount = yield this.accountsRepository.transferToAccount(input, tokenData);
                return updatedAccount;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    depositToAccount(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.money && input.money !== 0) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(417, "Missing token");
                }
                if (input.money <= 0) {
                    throw new CustomError_1.CustomError(417, "Money value must be greater than zero");
                }
                if (input.money > 2000) {
                    throw new CustomError_1.CustomError(417, "Money value cannot be greater than 2.000");
                }
                let bearer;
                let tokenString;
                if (token.includes('Bearer ')) {
                    [bearer, tokenString] = token.split('Bearer ');
                }
                else {
                    tokenString = token;
                }
                const tokenData = this.tokenGenerator.verify(tokenString);
                const updatedAccount = yield this.accountsRepository.depositToAccount(input, tokenData);
                return updatedAccount;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
}
exports.AccountBusiness = AccountBusiness;
exports.default = new AccountBusiness(new idGenerator_1.IdGenerator(), new AccountsRepository_1.AccountsRepository(), new tokenGenerator_1.TokenGenerator());
//# sourceMappingURL=AccountBusiness.js.map