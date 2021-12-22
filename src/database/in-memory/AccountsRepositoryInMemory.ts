import { Account } from "../model/Account"
import idGenerator from '../../business/services/idGenerator'
import { IAccountsRepository } from "../IAccountsRepositories/IAccountsRepositories"

class AccountsRepositoryInMemory implements IAccountsRepository {
    private accounts: Account[] = []

    async createAccount(account: Account): Promise<Account> {
        Object.assign(account, {
            id: idGenerator.generate()
        })

        this.accounts.push(account)

        return account
    }

    async checkAccount(cpf: string): Promise<boolean> {
        const account = this.accounts.some(account => account.getCpf() === cpf)
        return account
    }
}

export { AccountsRepositoryInMemory }