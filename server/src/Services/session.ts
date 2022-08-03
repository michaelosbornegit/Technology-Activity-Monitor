import { allSessions, insertSessions } from "../Models/session.model";
import { CreateSession, Session } from "../Types/session";

export class SessionService {
    public async getAll(): Promise<Session[]> {
        return await allSessions();
    }
    
    public async create(sessions: CreateSession[]): Promise<void> {
        await insertSessions(sessions);
    }
}