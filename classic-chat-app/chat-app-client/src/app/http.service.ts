import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

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
    return this.http.post(  environment.NODE_HOST + '/verifyLoginCredentials', { login_credentials: payload }, this.httpOptions);
  }

  createAccount(account_info) {
      const payload  = JSON.stringify(account_info);
      return this.http.post( environment.NODE_HOST +  '/createAccount', { account_information: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  getUserByID(id) {
      const payload  = JSON.stringify(id);
      return this.http.post(environment.NODE_HOST +  '/getUserByID', { user_id: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  createNewChatRoom(newChatRoom) {
      const payload  = JSON.stringify(newChatRoom);
      return this.http.post(environment.NODE_HOST +  '/createNewChatRoom', { new_message: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  getUserIDS(usernames) {
      const payload  = JSON.stringify(usernames);
      return this.http.post(environment.NODE_HOST +  '/getUserIDS', { usernames: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  getChatRoomsForUser(userid) {
      const payload  = JSON.stringify(userid);
      return this.http.post( environment.NODE_HOST +  '/getChatRoomsForUser', { userid: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  getRecentMessage(groupids) {
      const payload  = JSON.stringify(groupids);
      return this.http.post(environment.NODE_HOST +  '/getRecentMessage', { groupids: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  getMessages(groupid) {
      const payload  = JSON.stringify(groupid);
      return this.http.post(environment.NODE_HOST +  '/getMessages', { groupid: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  sendMessage(stuff) {
      const payload  = JSON.stringify(stuff);
      return this.http.post(environment.NODE_HOST +  '/sendMessage', { info: payload }, this.httpOptions).pipe( catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    var temp = ['SERVE ERROR: Server not responding. Try again later.'];
    console.log(temp[0]);
    return temp;
  }


}
