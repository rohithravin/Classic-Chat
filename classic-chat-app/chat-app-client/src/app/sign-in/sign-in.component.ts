import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../models/login-model';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  login_model:LoginModel;
  remember_check_box:boolean;
  errEmail:boolean;
  errPassword:boolean;

  constructor(private _router:Router, private _httpService:HttpService,private _snackBar: MatSnackBar) {

    if (localStorage.getItem('ClassicChat_account_created') == 'true'){
      this._snackBar.open('Account Created! Log in with new credentials.', 'Close', {
        verticalPosition: 'top'
      });
      localStorage.setItem('ClassicChat_account_created', 'false');
    }

    this.login_model = new LoginModel('','');
    this.remember_check_box = false;
    this.errEmail = false;
    this.errPassword = false;
    if(localStorage.getItem('ClassicChat_login_error')=='True'){
      localStorage.setItem('ClassicChat_login_error','False')
      this._snackBar.open('Incorrect Login Credentials. Try Again.', 'Close', {
        verticalPosition: 'top'
      });
    }

  }

  ngOnInit() {

  }


  LogIn(){
    if (this.login_model.email == '')
      this.errEmail = true;
    else
      this.errEmail = false;
    if (this.login_model.password == '')
      this.errPassword = true;
    else
      this.errPassword = false;

    if (!this.errPassword && !this.errEmail){
        console.log('Send Login Credentials')
        var err=this._httpService.verifyLoginCredentials(this.login_model);
        err.subscribe(data=>{
          console.log("response:", data);
          if (data['success'] == 1){
            this._snackBar.dismiss();
              if (this.remember_check_box == true)
                localStorage.setItem('ClassicChat_login_model', JSON.stringify(this.login_model));
              else
                localStorage.setItem('ClassicChat_login_model', '');
          }
          else{
            this._snackBar.open('Incorrect Login Credentials. Try Again.', 'Close', {
              verticalPosition: 'top'
            });
          }
        })
    }
    else{
      this._snackBar.open('Enter Required Fields.', 'Close', {
        verticalPosition: 'top'
      });
    }

  }

  RememberMe(){
    if (this.remember_check_box == false){
      this.remember_check_box = true;
    }
    else{
      this.remember_check_box = false;
    }
  }
}
