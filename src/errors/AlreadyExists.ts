import  httpStatusCodes  from './HttpStatusCode'

import { BaseError } from './BaseError'

export class AlreadyExists extends BaseError {
    constructor(
        name: string,
        statusCode = httpStatusCodes.CONFLICT,
        description = 'Already exists',
        isOperational = true
    ) {
        super(name, statusCode, description, isOperational)
    }
}