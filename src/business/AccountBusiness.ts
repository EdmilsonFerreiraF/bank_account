import { AccountsRepository } from "../database/prisma/AccountsRepository"
import { Account } from "../database/model/Account"
import { ICreateAccountDTO } from '../business/entities/account'
import { CustomError } from "../errors/CustomError"
import { AccountsRepositoryInMemory } from "../database/in-memory/AccountsRepositoryInMemory"

import { IdGenerator } from "./services/idGenerator"
import { TokenGenerator } from "./services/tokenGenerator"

export class AccountBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private accountsRepository: AccountsRepository | AccountsRepositoryInMemory,
        private tokenGenerator: TokenGenerator,
    ) { }

    public async createAccount(
        input: ICreateAccountDTO
    ): Promise<Account> {
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

            const account = await this.accountsRepository.createAccount(
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

            return account
        } catch (error: any) {
            if (error.message.includes('Unique constraint failed on the fields: (`cpf`)')) {
                throw new CustomError(409, "Account already exists")
            }

            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new AccountBusiness(new IdGenerator(), new AccountsRepository(), new TokenGenerator())