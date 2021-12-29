import { AccountsRepository } from "../database/prisma/AccountsRepository"
import { Account } from "../database/model/Account"

import { ICreateAccountDTO, IDepositToAccountDTO, ITransferToAccountDTO } from '../business/entities/account'

import { InvalidInput } from "../errors/InvalidInput"
import { Forbidden } from "../errors/Forbidden"
import { NotFound } from "../errors/NotFound"
import { BaseError } from "../errors/BaseError"
import { AlreadyExists } from "../errors/AlreadyExists"

import { IdGenerator } from "./services/idGenerator"
import { TokenGenerator } from "./services/tokenGenerator"

const maxMoney: number = 2000;
const minMoney: number = 0;
const CPFLength: number = 11;

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
                throw new InvalidInput("Missing input")
            }

            if (input.cpf.length !== CPFLength) {
                throw new InvalidInput("CPF must be 11 characters length")
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
                throw new AlreadyExists("Account already exists")
            }

            console.log('error:', error)
            throw new BaseError(error.name, error.description, error.statusCode, error.message)
        }
    }

    public async transferToAccount(
        input: ITransferToAccountDTO,
        token: string
    ): Promise<Account> {
        try {
            if (
                !input.cpf ||
                !input.money && input.money !== minMoney
            ) {
                throw new InvalidInput("Missing input")
            }

            if (
                !token
            ) {
                throw new InvalidInput("Missing token")
            }

            if (input.cpf.length !== CPFLength) {
                throw new InvalidInput(`CPF must be ${CPFLength} characters length`)
            }

            if (input.money <= minMoney) {
                throw new InvalidInput(`Money value must be greater than ${minMoney}`)
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
                throw new Forbidden("Cannot transfer to your own account")
            }

            const account: Account = await this.accountsRepository.getAccount(
                tokenData
            )

            if (!account) {
                throw new NotFound("Could not find receiver's account")
            }

            if (account.getBalance() - input.money < minMoney) {
                throw new Forbidden("Not enough money. Can't transfer a value above your money")
            }

            const updatedAccount = await this.accountsRepository.transferToAccount(
                input,
                tokenData
            )

            return updatedAccount
        } catch (error: any) {
            throw new BaseError(error.name, error.description, error.statusCode, error.message)
        }
    }

    public async depositToAccount(
        input: IDepositToAccountDTO,
        token: string
    ): Promise<Account> {
        try {
            if (
                !input.money && input.money !== minMoney
            ) {
                throw new InvalidInput("Missing input")
            }

            if (
                !token
            ) {
                throw new InvalidInput("Missing token")
            }

            if (input.money <= minMoney) {
                throw new InvalidInput("Money value must be greater than zero")
            }

            if (input.money > maxMoney) {
                throw new Forbidden("Money value cannot be greater than 2.000")
            }

            let bearer: string
            let tokenString: string

            if (token.includes('Bearer ')) {
                [bearer, tokenString] = token.split('Bearer ')
            } else {
                tokenString = token;
            }

            const tokenData = this.tokenGenerator.verify(tokenString)

            const updatedAccount = await this.accountsRepository.depositToAccount(
                input,
                tokenData
            )

            return updatedAccount
        } catch (error: any) {
            throw new BaseError(error.name, error.description, error.statusCode, error.message)
        }
    }
}

export default new AccountBusiness(new IdGenerator(), new AccountsRepository(), new TokenGenerator())