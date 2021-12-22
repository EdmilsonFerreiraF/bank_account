import { prisma } from "../client"

import { IAccount } from "../../business/entities/account"
import { Account } from "../model/Account"

export class AccountsRepository {
   protected tableName: string = "account"

   private toModel(dbModel?: any): Account {
      return (
         dbModel &&
         new Account(
            dbModel.id,
            dbModel.name,
            dbModel.cpf
         )
      )
   }

   public async createAccount(input: Account): Promise<Account> {
      try {
         const account: IAccount | null = await prisma.account.create({
            data: {
               id: input.getId(),
               name: input.getName(),
               cpf: input.getCpf(),
               balance: input.getBalance(),
            }
         })

         return this.toModel(account)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }
}

export default new AccountsRepository()