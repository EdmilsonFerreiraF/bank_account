export class Account {
    constructor(
        private id: string,
        private name: string,
        private cpf: string,
        private balance: number = 500,
    ) { }

    public getId(): string {
        return this.id
    }

    public getName(): string {
        return this.name
    }

    public getCpf(): string {
        return this.cpf
    }

    public getBalance(): number {
        return this.balance
    }

    public setName(name: string) {
        this.name = name
    }

    public setCpf(cpf: string) {
        this.cpf = cpf
    }

    public setBalance(balance: number) {
        this.balance = balance
    }

    public static toAccount(data?: any): Account | undefined {
        return (data && new Account(
            data.id,
            data.name,
            data.cpf,
            data.balance,
        ))
    }
}