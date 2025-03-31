import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface GetOneUserUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class GetOneUserUseCaseImpl implements GetOneUserUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.findById(this.identifierFactory.construct(params.id))
        if(!user) throw new Error(`User was not found. User id: ${params.id}`)

        return {
            user
        }
    }
}

interface Params {
    id: string
}

interface Response {
    user: Domain.User
}