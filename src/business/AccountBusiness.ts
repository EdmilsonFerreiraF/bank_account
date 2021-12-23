import { AccountsRepository } from "../database/prisma/AccountsRepository"
import { Account } from "../database/model/Account"
import { IAccount, ICreateAccountDTO, ITransferToAccountDTO } from '../business/entities/account'
import { CustomError } from "../errors/CustomError"

import { IdGenerator } from "./services/idGenerator"
import { TokenGenerator } from "./services/tokenGenerator"

export class AccountBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private accountsRepository: AccountsRepository,
        private tokenGenerator: TokenGenerator,
    ) { }

    public async createAccount(
        input: ICreateAccountDTO
    ): Promise<string> {
        try {
            if (
                !input.name ||
                !input.cpf
            ) {
                throw new CustomError(417, "Missing input")
            }

            if (input.cpf.length !== 11) {
                throw new CustomError(417, "CPF must be 11 characters length")
            }

            const id: string = this.idGenerator.generate()

            await this.accountsRepository.createAccount(
                new Account(
                    id,
                    input.name,
                    input.cpf
                )
            )

            const token: string = this.tokenGenerator.generate({
                id,
                cpf: input.cpf,
            });

            return token
        } catch (error: any) {
            if (error.message.includes('Unique constraint failed on the fields: (`cpf`)')) {
                throw new CustomError(409, "Account already exists")
            }

            throw new CustomError(error.statusCode, error.message)
        }
    }

    public async transferToAccount(
        input: ITransferToAccountDTO,
        token: string
    ): Promise<Account> {
        try {
            if (
                !input.cpf ||
                !input.money && input.money !== 0
            ) {
                throw new CustomError(417, "Missing input")
            }

            if (
                !token
            ) {
                throw new CustomError(417, "Missing token")
            }

            if (input.cpf.length !== 11) {
                throw new CustomError(417, "CPF must be 11 characters length")
            }

            if (input.money <= 0) {
                throw new CustomError(417, "Money value must be greater than zero")
            }

            let bearer: string
            let tokenString: string

            if (token.includes('Bearer ')) {
                [bearer, tokenString] = token.split('Bearer ')
            } else {
                tokenString = token;
            }

            const tokenData = this.tokenGenerator.verify(tokenString)

            if (input.cpf === tokenData.cpf) {
                throw new CustomError(403, "Cannot transfer to your own account")
            }

            const account = await this.accountsRepository.getAccount(
                input,
                tokenData
            )

            if (!account) {
                throw new CustomError(404, "Could not find receiver's account")
            }

            if (account.getBalance() - input.money < 0) {
                throw new CustomError(403, "Not enough money. Can't transfer a value above your money")
            }

            const updatedAccount = await this.accountsRepository.transferToAccount(
                input,
                tokenData
            )

            return updatedAccount
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new AccountBusiness(new IdGenerator(), new AccountsRepository(), new TokenGenerator())