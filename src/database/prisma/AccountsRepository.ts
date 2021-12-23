import { prisma } from "../client"

import { IAccount, ITransferToAccountDTO } from "../../business/entities/account"
import { Account } from "../model/Account"
import { AuthenticationData } from "../../business/services/tokenGenerator"

export class AccountsRepository {
   protected tableName: string = "account"

   private toModel(dbModel?: any): Account {
      return (
         dbModel &&
         new Account(
            dbModel.id,
            dbModel.name,
            dbModel.cpf,
            dbModel.balance,
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

   public async getAccount(input: ITransferToAccountDTO, tokenData: AuthenticationData): Promise<Account> {
      try {
         const userAccount = await prisma.account.findUnique({
            where: {
               cpf: tokenData.cpf,
            }
         })

         return this.toModel(userAccount)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }

   public async transferToAccount(input: ITransferToAccountDTO, tokenData: AuthenticationData): Promise<Account> {
      try {
         const userUpdatedAccount = await prisma.account.updateMany({
            where: {
               cpf: tokenData.cpf,
            },
            data: {
               balance: {
                  decrement: input.money,
               }
            }
         })

         await prisma.account.update({
            where: {
               cpf: input.cpf
            },
            data: {
               balance: {
                  increment: input.money,
               }
            }
         })

         return this.toModel(userUpdatedAccount)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }
}

export default new AccountsRepository()