import * as Inversify from "inversify";

import * as Domain from "app/domain";


export interface UserFactory {
    construct(params: Params): Domain.User
}

@Inversify.injectable()
export class UserFactoryImpl implements UserFactory {
    construct(params: Params): Domain.User {
        return new Domain.User(
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
     id: Domain.Identifier,
     phone: string,
     username: string,
     name: string,
     telegramId: string,
     createdAt: number,
     email?: string,
}