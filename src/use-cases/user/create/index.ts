import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"


export interface CreateUserUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class CreateUserUseCaseImpl implements CreateUserUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository
    ) {}

    public async execute(params: Params): Promise<Response> {
        const now = new Date()

        const user = await this.userRepository.create({
            phone: params.phone,
            username: params.username,
            name: params.name,
            telegramId: params.telegramId,
            createdAt: now.getTime(),
            email: params.email,
        })

        return {
            user
        }
    }
}

interface Params {
    phone: string,
    username: string,
    name: string,
    telegramId: string,
    email?: string,
}

interface Response {
    user: Domain.User
}