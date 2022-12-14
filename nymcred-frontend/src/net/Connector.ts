import { Session } from "./Session";
import { HttpMethod, sendFetch } from "./internal";
import { Api, GetUserResult } from "./Api";
import { SendTransactionRequest, ValidationRequest } from "./Messages";

/** 
 * A connection has an authentication status. Authenticated connections have session functionality 
 */
export type Connection = { 
  isAuthenticated: false 
  } | 
  ({
    isAuthenticated: true
  } & Session);

export class Connector {
  constructor(private globalErrorHandler: (err: string) => void) {}

  public validateCredential(publicKey: string, body: ValidationRequest, successHandler: (rsp: {data: string}) => void) {
    sendFetch(HttpMethod.POST, '/validate/' + publicKey, body, successHandler, this.globalErrorHandler)
  }

  public sendSignedTransaction(body: SendTransactionRequest, successHandler: (rsp: {data: string}) => void) {
    sendFetch(HttpMethod.POST, '/sendTransaction', body, successHandler, this.globalErrorHandler)
  }

  public initializeSession(resultHandler: (session: Connection) => void) {
      const api = new Api(this.globalErrorHandler);
      api.getUser((user: GetUserResult) => {
        const connection: Connection = {
            isAuthenticated: true,
            user: user,
            api,
        };
        resultHandler(connection);
      },
      // Handler to capture errors as failure is expected for unauthenticated users
      (err: string) => {  
          resultHandler({isAuthenticated: false});
      });
  }

  public requestMagicLinkLogin(email: string, successHandler: () => void) {
    sendFetch(HttpMethod.POST, '/auth/login', {email}, successHandler, this.globalErrorHandler);
  }

  public register(name: string, email: string, successHandler: () => void) {
    sendFetch(HttpMethod.POST, '/auth/register', {
      name,
      email
    }, successHandler, this.globalErrorHandler)
  }

  public verifyLink(state: string, successHandler: () => void) {
    sendFetch(HttpMethod.POST, '/auth/verify', {state}, successHandler, this.globalErrorHandler);
  }
}
