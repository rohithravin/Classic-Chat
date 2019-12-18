import { Component, OnInit, Inject } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpService }  from '../http.service';
import { LoginModel } from '../models/login-model';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  selectedChat:string;
  animal: string;
  name: string;

  constructor( private _router:Router, private _httpService:HttpService,private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.selectedChat = 'chat_1';
    this._snackBar.open('Login Sucessful!', 'Close', {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  ngOnInit() {
  }

  Logout(){
    localStorage.setItem('ClassicChat_login_model', '');
    this._router.navigate(['']);
  }

  NewMessageDialog(){
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '500px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
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

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
