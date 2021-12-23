
import request from 'supertest'

import { app } from '../../src/app'

describe.skip("Create account controller", () => {
    it("should return error when account already exists", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account")
            .send({
                name: "account_name",
                cpf: "account_cpf"
            })

        expect(res.statusCode).toBe(409)
        expect(res.text).toBe("{\"message\":\"Account already exists\"}")
    })

    it("should throw error when name is missing", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account")
            .send({
                cpf: "account_cpf"
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing input\"}")
    })

    it("should throw error when cpf is missing", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account")
            .send({
                name: "account_name",
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing input\"}")
    })

    it("should not be able to create an account if CPF is not 11 characters length", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account")
            .send({
                name: "account_name",
                cpf: "account_cpf_long"
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"CPF must be 11 characters length\"}")
    })

    it("should be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account")
            .send({
                name: "account_name",
                cpf: "account_cp8"
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("token")
    })
})