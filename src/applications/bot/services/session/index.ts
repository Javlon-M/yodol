import { ComponentsSymbols } from "app/components/dependency-symbols";
import { inject, injectable } from "inversify";
import type { Cache } from "app/infrastructure";
import type { SessionData } from "./session";

export interface SessionService {
    getSession(key: number): Promise<SessionData | null>;
    clearSession(key: number): Promise<void>;
    updateSession(key: number, data: Partial<SessionData>): Promise<void>;
}

@injectable()
export class SessionServiceImpl implements SessionService {
    constructor(
        @inject(ComponentsSymbols.Cache) private readonly cache: Cache,
    ) {}

    public async getSession(telegramId: number): Promise<SessionData | null> {
        const session = await this.cache.get(telegramId.toString());
        return session ? this.toSession(session) : null;
    }

    public async clearSession(key: number): Promise<void> {
    const session = await this.getSession(key);

    if (session?.userId) {
        await this.cache.set(
            key.toString(),
            this.toStorage({ userId: session.userId } as SessionData),
        );
    } else {
        await this.cache.remove(key.toString());
    }

    }

    public async updateSession(
        key: number,
        data: Partial<SessionData>,
    ): Promise<void> {
        const session = (await this.getSession(key)) || {};

        Object.assign(session, data);
        await this.cache.set(key.toString(), this.toStorage(session));
    }

    private toSession(session: string): SessionData {
        return JSON.parse(session);
    }

    private toStorage(session: SessionData): string {
        return JSON.stringify(session);
    }
}
