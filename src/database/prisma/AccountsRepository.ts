import { prisma } from "../client"

import { IAccount, IDepositToAccountDTO, ITransferToAccountDTO } from "../../business/entities/account"
import { AuthenticationData } from "../../business/services/tokenGenerator"

import { Account } from "../model/Account"

export class AccountsRepository {
   protected tableName: string = "account"

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

         return Account.toModel(account)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }

   public async getAccount(tokenData: AuthenticationData): Promise<Account> {
      try {
         const userAccount = await prisma.account.findUnique({
            where: {
               cpf: tokenData.cpf,
            }
         })

         return Account.toModel(userAccount)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }

   public async transferToAccount(input: ITransferToAccountDTO, tokenData: AuthenticationData): Promise<Account> {
      try {
         const userUpdatedAccount = await prisma.account.update({
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

         return Account.toModel(userUpdatedAccount)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }

   public async depositToAccount(input: IDepositToAccountDTO, tokenData: AuthenticationData): Promise<Account> {
      try {
         const userUpdatedAccount = await prisma.account.update({
            where: {
               cpf: tokenData.cpf
            },
            data: {
               balance: {
                  increment: input.money,
               }
            }
         })

         return Account.toModel(userUpdatedAccount)
      } catch (error: any) {
         throw new Error(error.message)
      }
   }
}

export default new AccountsRepository()