import { AccountBusiness } from "../../src/business/AccountBusiness";
import { ICreateAccountDTO, ITransferToAccountDTO }
    from "../../src/business/entities/account";
import { AuthenticationData } from "../../src/business/services/tokenGenerator";
import { Account } from "../../src/database/model/Account";

const accountDatabase = {
    transferToAccount: jest.fn(async (input: ITransferToAccountDTO, token: AuthenticationData) => {
        return Account.toAccount({
            id: token.id,
            name: "account_name",
            cpf: token.cpf,
            balance: input.money,
        })
    }),
    getAccount: jest.fn(async (input: ITransferToAccountDTO) => {
        switch (input.cpf) {
            case "account_unr":
                return undefined
            case "account_cp2":
                return Account.toAccount({
                    id: "account_id",
                    name: "account_name",
                    cpf: input.cpf,
                    balance: input.money,
                })
            default:
                return Account.toAccount({
                    id: "account_id",
                    name: "account_name",
                    cpf: "account_cp2",
                })
        }
    })
}

const tokenGenerator = {
    generate: jest.fn((payload: { id: string, cpf: string }) => "account_token"),
    verify: jest.fn((token: string) => {
        return { id: "account_id", cpf: "account_cp2" }
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
    test("Should return error when no CPF", async () => {
        expect.assertions(2)

        const account = {
            money: 100,
        } as any

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(account, token)
        } catch (error: any) {
            expect(error.message).toBe("Missing input")
            expect(error.statusCode).toBe(417)
        }
    })

    test("Should return error when no role", async () => {
        expect.assertions(2)

        const account = {
            cpf: "account_cpf"
        } as any

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(account, token)
        } catch (error: any) {
            expect(error.message).toBe("Missing input")
            expect(error.statusCode).toBe(417)
        }
    })

    test("Should return error when wrong CPF format", async () => {
        expect.assertions(2)

        const account = {
            cpf: "account_cpf_long",
            money: 100,
        } as any

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(account, token)
        } catch (error: any) {
            expect(error.message).toBe("CPF must be 11 characters length")
            expect(error.statusCode).toBe(417)
        }
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const input = {
            cpf: "account_cpf",
            money: 0,
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(417)
            expect(error.message).toBe("Money value must be greater than zero")
        }
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const input = {
            cpf: "account_cp2",
            money: 100
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(403)
            expect(error.message).toBe("Cannot transfer to your own account")
        }
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const input = {
            cpf: "account_unr",
            money: 100
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(404)
            expect(error.message).toBe("Could not find receiver's account")
        }
    })

    it("should not be able to create a new account", async () => {
        expect.assertions(2)

        const input = {
            cpf: "account_cpf",
            money: 200,
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.transferToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(403)
            expect(error.message).toBe("Not enough money. Can't transfer a value above your money")
        }
    })

    test("Should return token", async () => {
        expect.assertions(1)

        const input = {
            cpf: "account_cpf",
            money: 100,
        } as ITransferToAccountDTO

        const token = "account_token"

        const result: Account = await accountBusiness.transferToAccount(input, token)
        expect(result.getBalance()).toBe(100)
    })
})