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
    depositToAccount: jest.fn((input, token) => __awaiter(void 0, void 0, void 0, function* () {
        return Account_1.Account.toAccount({
            id: token.id,
            name: "account_name",
            cpf: token.cpf,
            balance: 100 + input.money,
        });
    })),
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
    test("should throw error when money is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const account = {};
        const token = "account_token";
        try {
            yield accountBusiness.depositToAccount(account, token);
        }
        catch (error) {
            expect(error.message).toBe("Missing input");
            expect(error.statusCode).toBe(417);
        }
    }));
    it("should not be able to deposit money when money is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            money: 0,
        };
        const token = "account_token";
        try {
            yield accountBusiness.depositToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(417);
            expect(error.message).toBe("Money value must be greater than zero");
        }
    }));
    it("should not be able to deposit money when money is greater than 2.000", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const input = {
            money: 3000,
        };
        const token = "account_token";
        try {
            yield accountBusiness.depositToAccount(input, token);
        }
        catch (error) {
            expect(error.statusCode).toBe(417);
            expect(error.message).toBe("Money value cannot be greater than 2.000");
        }
    }));
    it("Should be able to deposit money and return token", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const input = {
            money: 100,
        };
        const token = "account_token";
        const result = yield accountBusiness.depositToAccount(input, token);
        expect(result.getBalance()).toBe(200);
    }));
});
//# sourceMappingURL=DepositAccountService.spec.js.map