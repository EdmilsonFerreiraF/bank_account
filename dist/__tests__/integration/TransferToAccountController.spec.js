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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjN2ZhOWFiLTNlMmQtNDdiNy05MmE2LTVlNWQ1YTdlMGZlNCIsImNwZiI6ImFjY291bnRfYzMwIiwiaWF0IjoxNjQwMjQwNjYzLCJleHAiOjE2NDAyNDM2NjN9.1c7ep8KCkgs_ouRSzkrKiWq01kT1pBmQoLz9FnEtvjE";
describe("Create account controller", () => {
    it("should throw error when money is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_cpf",
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing input\"}");
    }));
    it("should throw error when cpf is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            money: 100,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing input\"}");
    }));
    it("should not be able to transfer money if token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .send({
            cpf: "account_cpf",
            money: 100,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing token\"}");
    }));
    it("should not be able to transfer money when CPF is not 11 characters length", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_cpf_long",
            money: 100,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"CPF must be 11 characters length\"}");
    }));
    it("should throw error when money is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_cpf",
            money: 0,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Money value must be greater than zero\"}");
    }));
    it("should not be able to transfer money to your own account", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_c30",
            money: 100,
        });
        expect(res.statusCode).toBe(403);
        expect(res.text).toBe("{\"message\":\"Cannot transfer to your own account\"}");
    }));
    it("should not transfer money to unregistered account", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_unr",
            money: 100
        });
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe("{\"message\":\"Could not find receiver's account\"}");
    }));
    it("should not allow transfer money more than you have", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_cpf",
            money: 500,
        });
        expect(res.statusCode).toBe(403);
        expect(res.text).toBe("{\"message\":\"Not enough money. Can't transfer a value above your money\"}");
    }));
    it("should be able to transfer money", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
            cpf: "account_cpf",
            money: 100,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.balance).toBe(100);
    }));
});
//# sourceMappingURL=TransferToAccountController.spec.js.map