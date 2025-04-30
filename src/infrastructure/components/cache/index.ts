export interface Cache {
    open(): Promise<void>

    close(): Promise<void>

    set(field: string, value: string, expireInSeconds: number): Promise<void>

    get(field: string): Promise<string>

    remove(key: string): Promise<void>

    has(field: string): Promise<boolean>
}