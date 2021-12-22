import  { Router } from "express"

import { AccountController } from "../AccountController"

const accountRouter = Router()
const accountController = new AccountController()

accountRouter.post("/account", accountController.createAccount)

export { accountRouter }