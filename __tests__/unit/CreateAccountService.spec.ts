import { AccountBusiness } from "../../src/business/AccountBusiness";
import { ICreateAccountDTO }
    from "../../src/business/entities/account";
import { Account } from "../../src/database/model/Account";

const accountDatabase = {
    createAccount: jest.fn(async (account: Account) => account),
    checkAccount: jest.fn(async (cpf: string) => {
        if (cpf === "id_usuario") {
            return true
        }

        return false
    }),
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
    test("Should return error when wrong CPF format", async () => {
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

    test("Should return error when no CPF", async () => {
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

    test("Should return error when no role", async () => {
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

    test("Should return token", async () => {
        expect.assertions(5)

        const account = {
            name: "account_name",
            cpf: "account_cp7",
        } as ICreateAccountDTO

        const result = await accountBusiness.createAccount(account)

        expect(result).toHaveProperty("id")
        expect(result.getName()).toBe("account_name")
        expect(result.getCpf()).toBe("account_cp7")
        expect(result).toHaveProperty("balance")
        expect(result.getBalance()).toBe(0)
    })
})