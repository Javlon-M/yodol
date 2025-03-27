import * as Inversify from "inversify"
import * as Mongoose from "mongoose"

import * as Domain from "app/domain"


export interface IdentifierFactory {
    construct(id: string): Domain.Identifier
}

@Inversify.injectable()
export class IdentifierFactoryImpl implements IdentifierFactory {
    public construct(id: string): Domain.Identifier {
        if (!id) {
            const newId = new Mongoose.Types.ObjectId()
            return new Domain.Identifier(
                newId.toHexString(),
                newId
            )
        }
        
        return new Domain.Identifier(
            id,
            new Mongoose.Types.ObjectId(id)
        )
    }
}