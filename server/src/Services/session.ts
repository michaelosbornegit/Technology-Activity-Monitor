import { insertChromeSession } from "../Models/chrome-session.model";
import { allSessions, insertSessions } from "../Models/session.model";
import { ChromeSession, CreateChromeSession, CreateSession, Session } from "../Types/session";

export class SessionService {
    public async getAll(): Promise<Session[]> {
        return await allSessions();
    }
    
    public async create(sessions: CreateSession[]): Promise<void> {
        await insertSessions(sessions);
    }
    
    public async createChromeSession(session: CreateChromeSession): Promise<void> {
        await insertChromeSession(session);
    }
}