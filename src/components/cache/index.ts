import * as Redis from "redis"
import * as Inversify from "inversify"

import * as Infrastructure from "app/infrastructure"


@Inversify.injectable()
export class CacheImpl implements Infrastructure.Cache {
    private client: Redis.RedisClientType

    public async open(): Promise<void> {
        try {
            if (this.client && this.client.isOpen) {
                console.error("Redis: Client already initialized")
                return
            }
    
            const config = this.getConfig()
    
            this.client = Redis.createClient({
                socket: {
                    host: config.host,
                    port: config.port,
                },
                database: config.dbNumber,
                pingInterval: config.pingInvl
            })
    
            this.client
                .on("error", (err) => console.error("Redis: Client error: ", err))
                .on("ready", () => console.log("Redis: Client is connected"))
                .on("reconnecting", () => console.log("Redis: Client is reconnecting"))
            
            await this.client.connect()
        }
        catch(error) {
            console.error("Redis: Initializing error", error)
            throw new Error("Redis: Initializing error")
        }
    }

    public async close(): Promise<void> {
        await this.getClient().disconnect()
        console.log("Redis: Connection closed")
    }

    public async set(field: string, value: string, expireInSeconds: number): Promise<void> {
        try {
            const fullkey = this.getKeyWithPrefix(field)

            await this.getClient().set(fullkey, value)
            await this.getClient().EXPIRE(fullkey, expireInSeconds)
        }
        catch(error) {
            console.error("Error while setting value ", error)
        }
    }

    public async get(field: string): Promise<string> {
        return await this.getClient().get(this.getKeyWithPrefix(field))
    }

    public async has(field: string): Promise<boolean> {
        return (await this.getClient().exists(this.getKeyWithPrefix(field))) === 1
    }

    public async remove(field: string): Promise<void> {
        await this.getClient().del(this.getKeyWithPrefix(field))
    }

    private getClient(): Redis.RedisClientType {
        if (!this.client.isReady) {
            throw new Error("Redis: Client is not ready")
        }

        return this.client
    }

    private getKeyWithPrefix(field: string): string {
        return `${this.getConfig().namespace}:${field}`
    }

    private getConfig(): CacheConfig {
        return {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
            dbNumber: parseInt(process.env.REDIS_DB_NUMBER),
            pingInvl: parseInt(process.env.REDIS_PING_INTERVAL),
            namespace: process.env.REDIS_NAMESPACE
        }
    }
}

interface CacheConfig {
    host: string
    port: number
    dbNumber: number
    pingInvl: number
    namespace: string
}