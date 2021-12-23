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
describe.skip("Create account controller", () => {
    it("should return error when account already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account")
            .send({
            name: "account_name",
            cpf: "account_cpf"
        });
        expect(res.statusCode).toBe(409);
        expect(res.text).toBe("{\"message\":\"Account already exists\"}");
    }));
    it("should throw error when name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account")
            .send({
            cpf: "account_cpf"
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing input\"}");
    }));
    it("should throw error when cpf is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account")
            .send({
            name: "account_name",
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"Missing input\"}");
    }));
    it("should not be able to create an account if CPF is not 11 characters length", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account")
            .send({
            name: "account_name",
            cpf: "account_cpf_long"
        });
        expect(res.statusCode).toBe(417);
        expect(res.text).toBe("{\"message\":\"CPF must be 11 characters length\"}");
    }));
    it("should be able to create a new account", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/account")
            .send({
            name: "account_name",
            cpf: "account_cp8"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    }));
});
//# sourceMappingURL=CreateAccountController.spec.js.map