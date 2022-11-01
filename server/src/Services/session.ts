import { insertChromeSession } from "../Models/chrome-session.model";
import { allSessions, insertSessions, pastDaySessions } from "../Models/session.model";
import type { DisplaySession, CreateChromeSession, Session, CreateSession } from "../Types/session";

export class SessionService {
    public async getAll(): Promise<Session[]> {
        return await allSessions();
    }

    public async getPastDaySessions(): Promise<DisplaySession> {
        return await pastDaySessions();
    }
    
    public async create(sessions: CreateSession[]): Promise<void> {
        await insertSessions(sessions);
    }
    
    public async createChromeSession(session: CreateChromeSession): Promise<void> {
        await insertChromeSession(session);
    }
}