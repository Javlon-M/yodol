export interface Storage {
    open(): Promise<void>

    close(): Promise<void>
}