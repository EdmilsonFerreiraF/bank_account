export interface IAccount {
    id: string
    name: string
    cpf: string
}

export interface ICreateAccountDTO {
    name: string
    cpf: string
}

export interface ITransferToAccountDTO {
    cpf: string
    money: number
}

export interface IDepositToAccountDTO {
    money: number
}