import { Types } from "mongoose"


export class Identifier {
    constructor (
        private value: string,
        private storageValue: StorageValue
    ) {}

    public toString(): string {
        return this.value
    }

    public toStorageValue(): StorageValue {
        return this.storageValue
    }
}

export type StorageValue = Types.ObjectId