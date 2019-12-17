import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';
import {Md5} from 'ts-md5/dist/md5';
import { LoginModel } from '../models/login-model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  login_model:LoginModel;


  constructor(private _router:Router, private _httpService:HttpService) {
    this.login_model = new LoginModel('','');
    localStorage.setItem('ClassicChat_login_error', '');
  }

  ngOnInit() {
  }

  checkLogIn(){
    var temp_login_model = localStorage.getItem('ClassicChat_login_model');
    if (temp_login_model == ''){
      this._router.navigate(['/signin']);
    }
    else{
      this.login_model = JSON.parse(temp_login_model);
      var err=this._httpService.verifyLoginCredentials(this.login_model);
      err.subscribe(data=>{
        if (data['success'] == 1){
          this._router.navigate(['/messages/' + Md5.hashStr(this.login_model.email).toString()]);
        }
        else{
          localStorage.setItem('ClassicChat_login_error', 'True');
          this._router.navigate(['/signin']);
        }
      })
    }
  }

}
