import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetOneUserByTelegramIdUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetOneUserByTelegramIdUseCaseImpl implements GetOneUserByTelegramIdUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.findByTelegramId(params.telegramId)
        if(!user) throw new Error(`User was not found. User id: ${params.telegramId}`)

        return {
            user
        }
    }
}

interface Params {
    telegramId: number
}

interface Response {
    user: Domain.User
}