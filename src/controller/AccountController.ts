import { Request, Response } from "express"

import {
   ICreateAccountDTO
} from "../business/entities/account"

import { AccountBusiness } from "../business/AccountBusiness"
import { AccountsRepository } from "../database/prisma/AccountsRepository"

import { IdGenerator } from "../business/services/idGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

const accountBusiness =
   new AccountBusiness(
      new IdGenerator(),
      new AccountsRepository(),
      new TokenGenerator(),
   )

export class AccountController {
   public async createAccount(req: Request, res: Response): Promise<void> {
      try {
         const { name, cpf } = req.body

         const input: ICreateAccountDTO = {
            name,
            cpf
         }

         const account = await accountBusiness.createAccount(input)

         res.status(200).send(account)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new AccountController()