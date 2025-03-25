import {inject, injectable} from "inversify";
import {User} from "app/domain";
import {UserFactory} from "app/factories";
import {Storage} from "app/infrastructure";
import {UserDocument} from "app/components";
import {FactorySymbols} from "app/factories/dependency-symbols";
import {ComponentsSymbols} from "app/components/dependency-symbols";


export interface UserRepository {
    create(params: CreateParams): Promise<User>
    remove(params: RemoveParams): Promise<void>
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
    constructor(
        @inject(FactorySymbols.DeckFactory) private userFactory: UserFactory,
        @inject(ComponentsSymbols.MongooseStorage) private storage: Storage,
    ){}

    public async create(params: CreateParams): Promise<User> {
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

    public async remove(params: RemoveParams): Promise<void> {
        await this.storage.getUsersCollection().findOneAndDelete({
            _id: params.id
        })
    }

    private toDomainEntity(user: UserDocument): User {
        if (!user) return null

        return this.userFactory.construct({
            id: user.id,
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