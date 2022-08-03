import { HostMachines } from "./enums";

export type CreateSession = {
  hostMachine: HostMachines;
  application: string;
  startCollectionDate: string;
  endCollectionDate: string;
  openTimeSeconds: number;
}

export type Session = CreateSession & {
  id: number;
};

export type SessionBody = {
  sessions: CreateSession[];
}
