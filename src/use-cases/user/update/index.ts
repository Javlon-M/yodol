import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface UpdateUserUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.update({
            ...params,
            id: this.identifierFactory.construct(params.id)
        })

        return {
            user
        }
    }
}

interface UpdateParams {
    phone: string
    username: string
    name: string
    email?: string
}

interface Params extends Partial<UpdateParams>{
    id: string
    telegramId: string
}

interface Response {
    user: Domain.User
}