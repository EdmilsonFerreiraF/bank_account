import { Account } from "../model/Account";

interface IAccountsRepository {
    createAccount(account: Account): any
    checkAccount(cpf: string): any
}

export { IAccountsRepository }