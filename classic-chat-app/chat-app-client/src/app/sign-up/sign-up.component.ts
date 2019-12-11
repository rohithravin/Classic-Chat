import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AccountModel } from '../models/account-model';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  account_model:AccountModel;
  errEmail:boolean;
  errPassword:boolean;
  errFirstName:boolean;
  errLastName:boolean;

  constructor(private _router:Router, private _httpService:HttpService, private _snackBar: MatSnackBar) {
    this.account_model  = new AccountModel('','','','');
    this.errEmail = false;
    this.errPassword = false;
    this.errFirstName = false;
    this.errLastName = false;

  }

  ngOnInit() {

  }



  CreateAccount(){
    if(this.Validate()){
        var err=this._httpService.createAccount(this.account_model);
        err.subscribe(data=>{
          if (typeof data === "string"){
            this._snackBar.open(data, 'Close', {
              verticalPosition: 'top'
            });
          }
          else{
            if (data['success'] == 1){
                localStorage.setItem('ClassicChat_account_created', 'true');
                this._router.navigate(['/signin']);
            }
            else{
              this._snackBar.open('SERVER ERROR MESSAGE: ' + data['message'], 'Close', {
                verticalPosition: 'top'
              });
            }
          }
        })
    }
  }

  SignIn(){
    this._snackBar.dismiss();
    this._router.navigate(['/signin']);
  }

  Validate(){
    if (this.account_model.email == '')
      this.errEmail = true;
    else
      this.errEmail = false;
    if (this.account_model.password == '')
      this.errPassword = true;
    else
      this.errPassword = false;
    if (this.account_model.first_name == '')
      this.errFirstName = true;
    else
      this.errFirstName = false;
    if (this.account_model.last_name == '')
      this.errLastName = true;
    else
      this.errLastName = false;
    if (this.errLastName || this.errFirstName || this.errEmail || this.errPassword){
      this._snackBar.open('USER ERROR: Enter required fields.', 'Close', {
        verticalPosition: 'top'
      });
      return false;
    }
    else{
      this._snackBar.dismiss();
      return true;
    }
  }
}
