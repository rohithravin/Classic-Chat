import { Component, OnInit, Inject } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpService }  from '../http.service';
import { LoginModel } from '../models/login-model';
import { NewMessageModel } from '../models/new-message-model';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountModel } from '../models/account-model';
import * as CryptoJS from 'crypto-js';





@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  selectedChat:string;
  animal: string;
  name: string;
  hideData:boolean;
  showData:boolean;
  current_user_id:number;
  current_user_account:AccountModel;


  new_group_name:string;
  new_group_usernames:string;
  new_group_message:string;

  constructor( private _router:Router, private _httpService:HttpService,private _snackBar: MatSnackBar, public dialog: MatDialog,  private activaterouter:ActivatedRoute,) {
    this.selectedChat = 'chat_1';
    this.hideData = true;
    this.showData = false;
    this.new_group_name = '';
    this.new_group_usernames= '';
    this.new_group_message= '';

  }

  ngOnInit() {
    this.activaterouter.params.subscribe(
      params => {
        this.current_user_id = Number(atob(params.userid))
        var err=this._httpService.getUserByID(this.current_user_id);
        err.subscribe(data=>{
          if (data['success'] == 1){
            this.current_user_account = new AccountModel(data['data'][0].FIRST_NAME,data['data'][0].LAST_NAME,data['data'][0].USERNAME,data['data'][0].PASSWORD );
            console.log(this.current_user_account)
            this.hideData = false;
            this.showData = true;
            this._snackBar.open('Login Sucessful!', 'Close', {
              verticalPosition: 'top',
              duration: 2000
            });
          }else{
            this._snackBar.open('Couldn\'t Find Your Account. Try Logging In Again.', 'Close', {
              verticalPosition: 'top',
              duration: 2000
            });
          }
        })
      })

  }

  Logout(){
    localStorage.setItem('ClassicChat_login_model', '');
    this._router.navigate(['']);
  }

  NewMessageDialog(){
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '900px',
      height: '660px',
      data: {groupname: this.new_group_name, usernames: this.new_group_usernames, message:this.new_group_message }
    });



  }


  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

}

@Component({
  selector: 'create-new-message-dialog',
  templateUrl: './create-new-message-dialog.html',
  styleUrls: ['./create-new-message-dialog.css'],
})
export class DialogOverviewExampleDialog {

  errGroupName:boolean;
  errUsernames:boolean;
  errMessage:boolean;


  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewMessageModel, private _snackBar: MatSnackBar, private _httpService:HttpService) {
      this.errGroupName = false;
      this.errUsernames= false;
      this.errMessage= false;

      this.data = new NewMessageModel("","","")

    }


  onNoClick(): void {
    if (this.data.groupname == '')
      this.errGroupName = true;
    else
      this.errGroupName = false;
    if (this.data.usernames == '')
      this.errUsernames = true;
    else
      this.errUsernames = false;
    if (this.data.message == '')
      this.errMessage = true;
    else
      this.errMessage = false;


    if (this.errMessage || this.errUsernames || this.errGroupName ){
      this._snackBar.open('USER ERROR: Enter required fields.', 'Close', {
        verticalPosition: 'top'
      });

    }
    else{
      this._snackBar.dismiss();
      var err=this._httpService.createNewChatRoom(this.data);
      err.subscribe(data=>{
        console.log("response:", data);
        if (data['success'] == 1){
          console.log(data)
        }
        else{
          console.log(data)
        }
      })

    }
    //this.dialogRef.close();
  }



}
