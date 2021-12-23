"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = require("express");
const AccountController_1 = require("../AccountController");
const accountRouter = (0, express_1.Router)();
exports.accountRouter = accountRouter;
const accountController = new AccountController_1.AccountController();
accountRouter.post("/account", accountController.createAccount);
accountRouter.post("/account/transfer", accountController.transferToAccount);
accountRouter.post("/account/deposit", accountController.depositToAccount);
//# sourceMappingURL=accountRouter.js.map