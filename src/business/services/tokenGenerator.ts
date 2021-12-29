import * as jwt from "jsonwebtoken"

import config from '../../config';

export class TokenGenerator {
  private static expiresIn: number = Number(config.jwt.expiresIn)

  public generate = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
        cpf: input.cpf,
      },
      config.jwt.key as string,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    )

    return newToken
  }

  public verify(token: string) {
    const payload = jwt.verify(token, config.jwt.key as string) as any
    const result = { id: payload.id, cpf: payload.cpf }

    return result
  }
}

export type AuthenticationData = {
  id: string,
  cpf: string,
}

export default new TokenGenerator()