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
const accountDatabase = {
    createAccount: jest.fn((account) => __awaiter(void 0, void 0, void 0, function* () { return account; }))
};
const tokenGenerator = {
    generate: jest.fn((payload) => "account_token"),
    getData: jest.fn((token) => {
        return { id: "token_id" };
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
            name: "account_name",
        };
        try {
            yield accountBusiness.createAccount(account);
        }
        catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(417);
        }
    }));
    test("Should return error when name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const account = {
            cpf: "account_cpf"
        };
        try {
            yield accountBusiness.createAccount(account);
        }
        catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(417);
        }
    }));
    test("should not be able to create an account if CPF is not 11 characters length", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const accountData = {
            name: "account_name",
            cpf: "account_cpf_long",
        };
        try {
            yield accountBusiness.createAccount(accountData);
        }
        catch (error) {
            expect(error.message).toBe("CPF must be 11 characters length");
            expect(error.statusCode).toBe(417);
        }
    }));
    test("should create a new account and return token", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const account = {
            name: "account_name",
            cpf: "account_cp7",
        };
        const result = yield accountBusiness.createAccount(account);
        expect(result).toHaveProperty("token");
    }));
});
//# sourceMappingURL=CreateAccountService.spec.js.map