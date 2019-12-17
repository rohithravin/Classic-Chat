import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

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
    return this.http.post('http://localhost:8887/verifyLoginCredentials', { login_credentials: payload }, this.httpOptions);
  }

  createAccount(account_info) {
      const payload  = JSON.stringify(account_info);
      return this.http.post('http://localhost:8887/createAccount', { account_information: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    var temp = ['SERVE ERROR: Server not responding. Try again later.'];
    console.log(temp[0]);
    return temp;
  }


}
