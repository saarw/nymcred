export const Globals = {
  isDevelopment: process.env.NODE_ENV === "development",
  API_URL: ((process.env.NODE_ENV === "development") ? "http://" + window.location.hostname + ":4000" : "https://web3gains.com") + "/api"
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export function sendFetch(method: HttpMethod, path: string, body: object | null, 
  successResponseFn: (data: any) => void, errorHandler?: (msg: string) => void) {
  const params: RequestInit = {
      credentials: 'include',
      method,
      headers: {},
      cache: 'no-store'
  };
  const csrfCookie = 'csrf-token'
  const cookies = decodeURIComponent(document.cookie).split(';')
  let headers: any = {}
  for(var i = 0; i <cookies.length; i++) {
      var c = cookies[i]
      while (c.charAt(0) === ' ') {
          c = c.substring(1)
      }
      if (c.indexOf(csrfCookie) === 0) {
          headers['X-CSRF-TOKEN'] = c.substring(csrfCookie.length + 1, c.length)
          break
      }
  }
  if (body) {
      params['body'] = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
  }
  params.headers = headers;
  fetch(Globals.API_URL + path, params)
  .then(function(response: Response) {
      if (response.status >= 200 && response.status <= 299) {
          response.json().then(function(data: any) {
              successResponseFn(data);
          })
          .catch(function(error) {
              console.log('Failed to read response json');
              console.log(error);
          })
      } else {
        if (errorHandler != undefined) {
                if (response.status === 401) {
                    errorHandler('Unauthorized access.')
                } else {
                    errorHandler('Bad response from server: ' + response.status);
                }
            } else {
            console.log('Bad response from server ' + response.status + ': ' + response.statusText);
        }
      }
  })
  .catch(function (error: any) {
    if (errorHandler != undefined) {
        errorHandler('An error occurred when communicating with the server: ' + error);
    } else {
        console.log('Failed to send request to ' + path);
        console.log(error);
    }
  });
}