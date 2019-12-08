import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class HttpService {

  constructor(private http: HttpClient) { }

  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json;charset=UTF-8',
       Accept: 'application/json'
     })
   };

  verifyLoginCredentials(login_info) {
    const payload  = JSON.stringify(login_info);
    return this.http.post('http://localhost:8888/verifyLoginCredentials', { login_credentials: payload }, this.httpOptions);
  }

  createAccount(account_info) {
    const payload  = JSON.stringify(account_info);
    return this.http.post('http://localhost:8888/createAccount', { account_information: payload }, this.httpOptions);
  }

}
