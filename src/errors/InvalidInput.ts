import httpStatusCodes from './HttpStatusCode'

import { BaseError } from './BaseError'

export class InvalidInput extends BaseError {
    constructor(
        name: string,
        statusCode = httpStatusCodes.EXPECTATION_FAILED,
        description = 'Invalid input',
        isOperational = true
    ) {
        super(name, statusCode, description, isOperational)
    }
}