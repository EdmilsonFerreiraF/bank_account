
import request from 'supertest'

import { app } from '../../src/app'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmRiZDI3LWMyYjEtNGFiMi1hYjJjLWEyMzJhOGFhMmYwZiIsImNwZiI6ImFjY291bnRfYzMxIiwiaWF0IjoxNjQwMjcwMTk5LCJleHAiOjE2NDAyNzMxOTl9.Q8bFsOff83vWO1R72ctYAoORnYlEXIRrR2acGmpxCiI"

describe("Create account controller", () => {
    it("should return error when money is not provided", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing input\"}")
    })

    it("should throw error when token is missing", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/deposit")
            .send({
                money: 100,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Missing token\"}")
    })

    it("should not be able to deposit money when money is less than or equal to zero", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
                money: 0,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Money value must be greater than zero\"}")
    })

    it("should not be able to deposit money when money is greater than 2.000", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
                money: 3000,
            })

        expect(res.statusCode).toBe(417)
        expect(res.text).toBe("{\"message\":\"Money value cannot be greater than 2.000\"}")
    })

    it("should be able to deposit money", async () => {
        expect.assertions(2)

        const res = await request(app)
            .post("/account/deposit")
            .auth(token, { type: 'bearer' })
            .send({
                money: 100,
            })

        expect(res.statusCode).toBe(200)
        expect(res.body.account.balance).toBe(1200)
    })
})