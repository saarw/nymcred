import React, { createContext } from "react";
import { Api, GetUserResult } from "./Api";

export const SessionContext = createContext<Session>({} as any); // Default value is never used

export interface Session {
  user: GetUserResult;
  api: Api;
};
