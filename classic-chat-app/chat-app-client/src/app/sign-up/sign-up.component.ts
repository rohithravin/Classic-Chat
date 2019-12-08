import { Component, OnInit } from '@angular/core';
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
  errErrorMessage:boolean;
  errMessage:string;


  constructor(private _router:Router, private _httpService:HttpService) {
    this.account_model  = new AccountModel('','','','');
    this.errEmail = false;
    this.errPassword = false;
    this.errFirstName = false;
    this.errLastName = false;
    this.errErrorMessage = false;
    this.errMessage = 'Server error. Please try again later';

  }

  ngOnInit() {
    
  }



  CreateAccount(){
    console.log(this.account_model);
    if(this.Validate()){
      var err=this._httpService.createAccount(this.account_model);
      err.subscribe(data=>{
        console.log("response:", data);
        if (data['success'] == 1){
            this.errErrorMessage = false;
            this._router.navigate(['/signin']);
        }
        else{
          this.errMessage = data['message'];
          this.errErrorMessage = true;
        }
      })
    }
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
    if (this.errLastName && this.errFirstName && this.errEmail && this.errPassword)
      return false;
    else
      return true;
  }
}
