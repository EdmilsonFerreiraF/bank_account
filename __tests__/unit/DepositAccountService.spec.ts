import { AccountBusiness } from "../../src/business/AccountBusiness";
import { ICreateAccountDTO, ITransferToAccountDTO }
    from "../../src/business/entities/account";
import { AuthenticationData } from "../../src/business/services/tokenGenerator";
import { Account } from "../../src/database/model/Account";

const accountDatabase = {
    depositToAccount: jest.fn(async (input: ITransferToAccountDTO, token: AuthenticationData) => {
        return Account.toAccount({
            id: token.id,
            name: "account_name",
            cpf: token.cpf,
            balance: 100 + input.money,
        })
    }),
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
    test("should throw error when money is missing", async () => {
        expect.assertions(2)

        const account = {
        } as any

        const token = "account_token"

        try {
            await accountBusiness.depositToAccount(account, token)
        } catch (error: any) {
            expect(error.message).toBe("Missing input")
            expect(error.statusCode).toBe(417)
        }
    })

    it("should not be able to deposit money when money is less than or equal to zero", async () => {
        expect.assertions(2)

        const input = {
            money: 0,
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.depositToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(417)
            expect(error.message).toBe("Money value must be greater than zero")
        }
    })

    it("should not be able to deposit money when money is greater than 2.000", async () => {
        expect.assertions(2)

        const input = {
            money: 3000,
        } as ITransferToAccountDTO

        const token = "account_token"

        try {
            await accountBusiness.depositToAccount(input, token)
        } catch (error: any) {
            expect(error.statusCode).toBe(417)
            expect(error.message).toBe("Money value cannot be greater than 2.000")
        }
    })

    it("Should be able to deposit money and return token", async () => {
        expect.assertions(1)

        const input = {
            money: 100,
        } as ITransferToAccountDTO

        const token = "account_token"

        const result: Account = await accountBusiness.depositToAccount(input, token)
        expect(result.getBalance()).toBe(200)
    })
})