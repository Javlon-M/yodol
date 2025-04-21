import * as Inversify from "inversify"

import * as Domain from "app/domain"
import * as Factories from "app/factories"
import * as Repositories from "app/repositories"

import { RepositorySymbols } from "app/repositories/dependency-symbols"
import { FactorySymbols } from "app/factories/dependency-symbols"


export interface CreateDeckUseCase {
    execute(params: Params): Promise<Response>
}

@Inversify.injectable()
export class CreateDeckUseCaseImpl implements CreateDeckUseCase {
    constructor(
        @Inversify.inject(RepositorySymbols.DeckRepository) private deckRepository: Repositories.DeckRepository,
        @Inversify.inject(RepositorySymbols.UserRepository) private userRepository: Repositories.UserRepository,
        @Inversify.inject(FactorySymbols.IdentifierFactory) private identifierFactory: Factories.IdentifierFactory,
    ) {}

    public async execute(params: Params): Promise<Response> {
        const user = await this.userRepository.findById(this.identifierFactory.construct(params.userId))
        if (!user) throw new Error(`User was not found. User id: ${params.userId}`)
        
        const deck = await this.deckRepository.create({
            title: params.title,
            active: true,
            userId: params.userId,
            description: params.description,
            configurations: this.getDefaultConf()
        })
        if (!deck) {
            console.log(`Deck was not created! User id ${params.userId}`)
        }

        return {
            deck
        }
    }

    private getDefaultConf(): Configurations {
        return {
            new: {
                'delays': [1, 10],
                'ints': [1, 4],
                'initialFactor': 2500,
                'perDay': 20,
            },
            rev: {
                'perDay': 200,
                'ease4': 1.3,
                'maxIvl': 36500,
                'hardFactor': 1.2,
            },
            lapse: {
                'delays': [10],
                'mult': 0,
                'minInt': 1,
                'leechFails': 8,
            },
        }
    }
}

interface Params {
    userId: string
    title: string
    description?: string
}

interface Response {
    deck: Domain.Deck
}

interface Configurations {
    new: {
        delays: number[]
        ints: number[]
        initialFactor: number
        perDay: number
    },
    rev: {
        perDay: number
        ease4: number
        maxIvl: number
        hardFactor: number
    },
    lapse: {
        delays: number[]
        mult: number
        minInt: number
        leechFails: number
    }
}
