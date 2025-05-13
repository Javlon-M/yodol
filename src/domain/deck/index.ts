import * as Domain from "app/domain"

export class Deck {
    constructor(
        private id: Domain.Identifier,
        private userId: string,
        private title: string,
        private active: boolean,
        private configurations: Configurations,
        private description?: string
    ) {}

    public getId(): Domain.Identifier {
        return this.id
    }

    public getUserId(): string {
        return this.userId
    }

    public getTitle(): string {
        return this.title
    }

    public getActive(): boolean {
        return this.active
    }

    public getDescription(): string {
        return this.description
    }

    public getConfigurations(): Configurations {
        return this.configurations
    }

    public getConfigurationsNewDelays(): number[] {
        return this.configurations.new.delays
    }
    
    public getConfigurationsNewInts(): number[] {
        return this.configurations.new.ints
    }

    public getConfigurationsNewInitialFactor(): number {
        return this.configurations.new.initialFactor
    }

    public getConfigurationsNewPerDay(): number {
        return this.configurations.new.perDay
    }

    public getConfigurationsRevPerDay(): number {
        return this.configurations.rev.perDay
    }

    public getConfigurationsRevEase4(): number {
        return this.configurations.rev.ease4
    }

    public getConfigurationsRevMaxIvl(): number {
        return this.configurations.rev.maxIvl
    }

    public getConfigurationsRevHardFactor(): number {
        return this.configurations.rev.hardFactor
    }

    public getConfigurationsLapseDelays(): number[] {
        return this.configurations.lapse.delays
    }

    public getConfigurationsLapseMult(): number {
        return this.configurations.lapse.mult
    }

    public getConfigurationsLapseMinInt(): number {
        return this.configurations.lapse.minInt
    }

    public getConfigurationsLapseLeechFails(): number {
        return this.configurations.lapse.leechFails
    }
}

interface Configurations {
        new: {
            delays: number[]
            ints: number[]
            initialFactor: number
            perDay: number
        }
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