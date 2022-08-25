import { HttpMethod, sendFetch } from "./internal";

export interface GetUserResult {
  name: string,
  email: string
}

// API with functions that authenticated users can perform
export class Api {
  constructor(private readonly errorHandler: (err: string) => void = (err) => {console.log('API error: ' + err)}) {
  }

  public getUser(successHandler: (user: GetUserResult) => void, errorHandler?: (err: string) => void): void {
    sendFetch(HttpMethod.GET, "/user", null, successHandler, errorHandler || this.errorHandler);
  }

  public changeEmailAddress(newEmail: string, successHandler: () => void) {
    sendFetch(HttpMethod.PUT, '/auth', {newEmail}, successHandler, this.errorHandler);
  }

  public signOut(successHandler: () => void)  {
    sendFetch(HttpMethod.DELETE, '/auth', null, successHandler, this.errorHandler);
  }
}
