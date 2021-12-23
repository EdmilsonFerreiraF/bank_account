import { AccountBusiness } from "../../src/business/AccountBusiness";
import { ICreateAccountDTO }
    from "../../src/business/entities/account";
import { Account } from "../../src/database/model/Account";

const accountDatabase = {
    createAccount: jest.fn(async (account: Account) => account)
}
const tokenGenerator = {
    generate: jest.fn((payload: { id: string, cpf: string }) => "account_token"),
    getData: jest.fn((token: string) => {
        return { id: "token_id" }
    })
}
const idGenerator = {
    generate: jest.fn(() => "account_id")
}

const accountBusiness = new AccountBusiness(
    idGenerator as any,
    accountDatabase as any,
    tokenGenerator as any
)

describe("Create account test flow", () => {
    test("should throw error when cpf is missing", async () => {
        expect.assertions(2)

        const account = {
            name: "account_name",
        } as ICreateAccountDTO

        try {
            await accountBusiness.createAccount(account)
        } catch (error: any) {
            expect(error.message).toBe("Missing input")
            expect(error.statusCode).toBe(417)
        }
    })
    
    test("Should return error when name is missing", async () => {
        expect.assertions(2)

        const account = {
            cpf: "account_cpf"
        } as ICreateAccountDTO

        try {
            await accountBusiness.createAccount(account)
        } catch (error: any) {
            expect(error.message).toBe("Missing input")
            expect(error.statusCode).toBe(417)
        }
    })

    test("should not be able to create an account if CPF is not 11 characters length", async () => {
        expect.assertions(2)

        const accountData = {
            name: "account_name",
            cpf: "account_cpf_long",
        } as ICreateAccountDTO

        try {
            await accountBusiness.createAccount(accountData)
        } catch (error: any) {
            expect(error.message).toBe("CPF must be 11 characters length")
            expect(error.statusCode).toBe(417)
        }
    })

    test("should create a new account and return token", async () => {
        expect.assertions(1)

        const account = {
            name: "account_name",
            cpf: "account_cp7",
        } as ICreateAccountDTO

        const result = await accountBusiness.createAccount(account)

        expect(result).toHaveProperty("token")
    })
})