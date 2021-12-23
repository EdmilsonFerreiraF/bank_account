import { Router } from "express"

import { AccountController } from "../AccountController"

const accountRouter = Router()
const accountController = new AccountController()

accountRouter.post("/account", accountController.createAccount)
accountRouter.post("/account/transfer", accountController.transferToAccount)
accountRouter.post("/account/deposit", accountController.depositToAccount)

export { accountRouter }