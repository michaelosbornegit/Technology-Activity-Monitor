import { application } from "express";
import { Knex } from "knex";
import { CreateSession, Session } from "../Types/session";
import pg from "./common";

const SESSION_TABLE = "sessions";

export const insertSessions = async (sessions: CreateSession[]) => {
  console.log("getting called");
  // console.log(sessions);

  const results = await pg<Session>("sessions").insert(sessions);
  console.log(results);
};
export const allSessions = async () => {
  const results = await pg<Session>(SESSION_TABLE).select();
  return results;
};
