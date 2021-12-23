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
const AccountBusiness_1 = require("../../src/business/AccountBusiness");
const Account_1 = require("../../src/database/model/Account");
const accountDatabase = {
    transferToAccount: jest.fn((input, token) => __awaiter(void 0, void 0, void 0, function* () {
        return Account_1.Account.toAccount({
            id: token.id,
            name: "account_name",
            cpf: token.cpf,
            balance: input.money,
        });
    })),
    getAccount: jest.fn((input) => __awaiter(void 0, void 0, void 0, function* () {
        switch (input.cpf) {
            case "account_unr":
                return undefined;
            case "account_cp2":
                return Account_1.Account.toAccount({
                    id: "account_id",
                    name: "account_name",
                    cpf: input.cpf,
                    balance: input.money,
                });
            default:
                return Account_1.Account.toAccount({
                    id: "account_id",
                    name: "account_name",
                    cpf: "account_cp2",
                });
        }
    }))
};
const tokenGenerator = {
    generate: jest.fn((payload) => "account_token"),
    verify: jest.fn((token) => {
        return { id: "account_id", cpf: "account_cp2" };
    })
};
const idGenerator = {
    generate: jest.fn(() => "account_id")
};
const accountBusiness = new AccountBusiness_1.AccountBusiness(idGenerator, accountDatabase, tokenGenerator);
describe("Create account test flow", () => {
    test("should throw error when cpf is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const account = {
            money: 100,
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(account, token);
        }
        catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(417);
        }
    }));
    test("Should return error if money is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const account = {
            cpf: "account_cpf"
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(account, token);
        }
        catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(417);
        }
    }));
    test("should not be able to create an account if CPF is not 11 characters length", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const account = {
            cpf: "account_cpf_long",
            money: 100,
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(account, token);
        }
        catch (error) {
            expect(error.message).toBe("CPF must be 11 characters length");
            expect(error.statusCode).toBe(417);
        }
    }));
    it("should throw error when money is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            cpf: "account_cpf",
            money: 0,
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(417);
            expect(error.message).toBe("Money value must be greater than zero");
        }
    }));
    it("should not be able to transfer to your own account", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            cpf: "account_cp2",
            money: 100
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(403);
            expect(error.message).toBe("Cannot transfer to your own account");
        }
    }));
    it("should not transfer money to unregistered account", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            cpf: "account_unr",
            money: 100
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe("Could not find receiver's account");
        }
    }));
    it("should not allow transfer money more than you have", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            cpf: "account_cpf",
            money: 200,
        };
        const token = "account_token";
        try {
            yield accountBusiness.transferToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(403);
            expect(error.message).toBe("Not enough money. Can't transfer a value above your money");
        }
    }));
    it("Should be able to transfer money and return token", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const input = {
            cpf: "account_cpf",
            money: 100,
        };
        const token = "account_token";
        const result = yield accountBusiness.transferToAccount(input, token);
        expect(result.getBalance()).toBe(100);
    }));
});
//# sourceMappingURL=TransferToAccountService.spec.js.map