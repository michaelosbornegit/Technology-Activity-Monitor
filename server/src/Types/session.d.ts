import { HostMachines } from "./enums";

export type CreateSession = {
  hostMachine: HostMachines;
  application: string;
  // TODO, you could move these up to Session to make the request smaller
  startCollectionDate: string;
  endCollectionDate: string;
  openTimeSeconds: number;
}

export type Session = CreateSession & {
  id: number;
};

export type CreateChromeSession = {
  url: string;
  navigationDate: string;
}

export type ChromeSession = CreateChromeSession & {
  id: number;
}

export type SessionBody = {
  sessions: CreateSession[];
}

export type ChromeSessionBody = {
  url: string;
  navigationDate: string;
}
