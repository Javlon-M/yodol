import {User} from "app/domain";
import {injectable} from "inversify";

export interface UserFactory {
    construct: (params:Params) => User;
}

@injectable()
export class UserFactoryImpl implements UserFactory {
    construct(params: Params): User {
        return new User(
            params.id,
            params.phone,
            params.username,
            params.name,
            params.telegramId,
            params.createdAt,
            params.email,
        )
    }
}

interface Params {
     id: string,
     phone: string,
     username: string,
     name: string,
     telegramId: string,
     createdAt: number,
     email?: string,
}