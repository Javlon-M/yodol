import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Models from "app/components"
import * as Factories from "app/factories"
import * as Infrastructure from "app/infrastructure"

import { FactorySymbols } from "app/factories/dependency-symbols"
import { ComponentsSymbols } from "app/components/dependency-symbols"


export interface UserRepository {
    create(params: CreateParams): Promise<Domain.User>
    remove(params: RemoveParams): Promise<Domain.User>
    findById(id: Domain.Identifier): Promise<Domain.User>
}

@Inversify.injectable()
export class UserRepositoryImpl implements UserRepository {
    constructor(
        @Inversify.inject(FactorySymbols.DeckFactory) private userFactory: Factories.UserFactory,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
        @Inversify.inject(ComponentsSymbols.MongooseStorage) private storage: Infrastructure.Storage,
    ){}

    public async create(params: CreateParams): Promise<Domain.User> {
        const user = await this.storage.getUsersCollection().insertOne({
            phone: params.phone,
            username: params.username,
            name: params.name,
            telegram_id: params.telegramId,
            email: params.email,
            created_at: params.createdAt
        })

        return this.toDomainEntity(user)
    }

    public async remove(params: RemoveParams): Promise<Domain.User> {
        return await this.storage.getUsersCollection().findOneAndDelete({
            _id: params.id
        })
    }

    public async findById(id: Domain.Identifier): Promise<Domain.User> {
        const user = await this.storage.getUsersCollection().findById<Models.UserDocument>({
            _id: id.toStorageValue()
        })

        return this.toDomainEntity(user)
    }

    private toDomainEntity(user: Models.UserDocument): Domain.User {
        if (!user) return null

        return this.userFactory.construct({
            id: this.identifierFactory.construct(user.id),
            phone: user.phone,
            username: user.username,
            name: user.name,
            telegramId: user.telegram_id,
            email: user.email,
            createdAt: user.created_at
        })
    }
}

interface CreateParams {
    phone: string,
    username: string,
    name: string,
    telegramId: string,
    createdAt: number,
    email?: string,
}

interface RemoveParams {
    id: string
}