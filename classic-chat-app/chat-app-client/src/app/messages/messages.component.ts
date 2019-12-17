import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpService }  from '../http.service';
import { LoginModel } from '../models/login-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  selectedChat:string;

  constructor( private _router:Router, private _httpService:HttpService,private _snackBar: MatSnackBar) {
    this.selectedChat = 'chat_1';
    this._snackBar.open('Login Sucessful!', 'Close', {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  ngOnInit() {
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
}

}
