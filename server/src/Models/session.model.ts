import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { application } from "express";
import { Knex } from "knex";
import type { CreateSession, DisplaySession, Session } from "../Types/session";
import pg from "./common";
dayjs.extend(utc)

const SESSION_TABLE = "sessions";

export const insertSessions = async (sessions: CreateSession[]) => {
  console.log(sessions);

  await pg<Session>("sessions").insert(sessions);
};

export const allSessions = async () => {
  const results = await pg<Session>(SESSION_TABLE).select();
  return results;
};

export const pastDaySessions = async () => {
  const results = await pg<Session>(SESSION_TABLE).select().where('endCollectionDate', '>=', dayjs.utc().subtract(1, 'day').toISOString()).where('endCollectionDate', '<', dayjs.utc().toISOString()).orderBy('endCollectionDate', 'asc');

  const displaySession: DisplaySession = {
    applicationNames: [],
    applicationTimeAndEndDate: [],
  };

  // Map to digestable sessions
  for (let i = 0; i < results.length; i++) {
    if (displaySession.applicationNames.findIndex((session) => session === results[i].application) === -1) {
      displaySession.applicationNames.push(results[i].application);
    }
    
    const currentEndDate = dayjs.utc(results[i].endCollectionDate).toISOString();
    const newDisplaySession: { [id: string]: string | number } = {};

    newDisplaySession['endCollectionDate'] = results[i].endCollectionDate;
    newDisplaySession[results[i].application] = results[i].openTimeSeconds;
    
    while (i < results.length - 1 && currentEndDate == dayjs.utc(results[i + 1].endCollectionDate).toISOString()) {
      i++;
      if (displaySession.applicationNames.findIndex((session) => session === results[i].application) === -1) {
        displaySession.applicationNames.push(results[i].application);
      }
      newDisplaySession[results[i].application] = results[i].openTimeSeconds;
    }

    displaySession.applicationTimeAndEndDate.push(newDisplaySession);
  }

  return displaySession;
};
