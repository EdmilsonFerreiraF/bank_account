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
exports.AccountsRepository = void 0;
const client_1 = require("../client");
const Account_1 = require("../model/Account");
class AccountsRepository {
    constructor() {
        this.tableName = "account";
    }
    toModel(dbModel) {
        return (dbModel &&
            new Account_1.Account(dbModel.id, dbModel.name, dbModel.cpf, dbModel.balance));
    }
    createAccount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield client_1.prisma.account.create({
                    data: {
                        id: input.getId(),
                        name: input.getName(),
                        cpf: input.getCpf(),
                        balance: input.getBalance(),
                    }
                });
                return this.toModel(account);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getAccount(input, tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAccount = yield client_1.prisma.account.findUnique({
                    where: {
                        cpf: tokenData.cpf,
                    }
                });
                return this.toModel(userAccount);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    transferToAccount(input, tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userUpdatedAccount = yield client_1.prisma.account.update({
                    where: {
                        cpf: tokenData.cpf,
                    },
                    data: {
                        balance: {
                            decrement: input.money,
                        }
                    }
                });
                yield client_1.prisma.account.update({
                    where: {
                        cpf: input.cpf
                    },
                    data: {
                        balance: {
                            increment: input.money,
                        }
                    }
                });
                return this.toModel(userUpdatedAccount);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    depositToAccount(input, tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userUpdatedAccount = yield client_1.prisma.account.update({
                    where: {
                        cpf: tokenData.cpf
                    },
                    data: {
                        balance: {
                            increment: input.money,
                        }
                    }
                });
                return this.toModel(userUpdatedAccount);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.AccountsRepository = AccountsRepository;
exports.default = new AccountsRepository();
//# sourceMappingURL=AccountsRepository.js.map