"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(id, name, cpf, balance = 500) {
        this.id = id;
        this.name = name;
        this.cpf = cpf;
        this.balance = balance;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getCpf() {
        return this.cpf;
    }
    getBalance() {
        return this.balance;
    }
    setName(name) {
        this.name = name;
    }
    setCpf(cpf) {
        this.cpf = cpf;
    }
    setBalance(balance) {
        this.balance = balance;
    }
    static toAccount(data) {
        return (data && new Account(data.id, data.name, data.cpf, data.balance));
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map