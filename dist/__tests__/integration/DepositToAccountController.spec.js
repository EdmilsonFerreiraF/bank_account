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
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmRiZDI3LWMyYjEtNGFiMi1hYjJjLWEyMzJhOGFhMmYwZiIsImNwZiI6ImFjY291bnRfYzMxIiwiaWF0IjoxNjQwMjcwMTk5LCJleHAiOjE2NDAyNzMxOTl9.Q8bFsOff83vWO1R72ctYAoORnYlEXIRrR2acGmpxCiI";
describe("Create account controller", () => {
    it("should return error when money is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing input\"}");
    }));
    it("should throw error when token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/deposit")
            .send({
            money: 100,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing token\"}");
    }));
    it("should not be able to deposit money when money is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
            money: 0,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Money value must be greater than zero\"}");
    }));
    it("should not be able to deposit money when money is greater than 2.000", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
            money: 3000,
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Money value cannot be greater than 2.000\"}");
    }));
    it("should be able to deposit money", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
            money: 100,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.account.balance).toBe(1200);
    }));
});
//# sourceMappingURL=DepositToAccountController.spec.js.map