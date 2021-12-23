
import request from 'supertest'

import { app } from '../../src/app'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjN2ZhOWFiLTNlMmQtNDdiNy05MmE2LTVlNWQ1YTdlMGZlNCIsImNwZiI6ImFjY291bnRfYzMwIiwiaWF0IjoxNjQwMjQwNjYzLCJleHAiOjE2NDAyNDM2NjN9.1c7ep8KCkgs_ouRSzkrKiWq01kT1pBmQoLz9FnEtvjE"

describe("Create account controller", () => {
    it("should return error when account already exists", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_cpf",
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing input\"}")
    })

    it("should ", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                money: 100,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing input\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .send({
                cpf: "account_cpf",
                money: 100,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing token\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_cpf_long",
                money: 100,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"CPF must be 11 characters length\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_cpf",
                money: 0,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Money value must be greater than zero\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_c30",
                money: 100,
            })

        expect(res.statusCode).toBe(403)
        expect(res.text).toBe("{\"message\":\"Cannot transfer to your own account\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_unr",
                money: 100
            })

        expect(res.statusCode).toBe(404)
        expect(res.text).toBe("{\"message\":\"Could not find receiver's account\"}")
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_cpf",
                money: 500,
            })

        expect(res.statusCode).toBe(403)
        expect(res.text).toBe("{\"message\":\"Not enough money. Can't transfer a value above your money\"}")
    })

    it("should be able to create a new account", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/transfer")
            .auth(token, { type: 'bearer' })
            .send({
                cpf: "account_cpf",
                money: 100,
            })

        expect(res.statusCode).toBe(200)
        expect(res.body.balance).toBe(100)
    })
})