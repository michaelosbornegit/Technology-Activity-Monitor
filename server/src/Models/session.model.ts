import { application } from "express";
import { Knex } from "knex";
import { CreateSession, Session } from "../Types/session";
import pg from "./common";

const SESSION_TABLE = "sessions";

export const insertSessions = async (sessions: CreateSession[]) => {
  console.log(sessions);

  await pg<Session>("sessions").insert(sessions);
};
export const allSessions = async () => {
  const results = await pg<Session>(SESSION_TABLE).select();
  return results;
};
