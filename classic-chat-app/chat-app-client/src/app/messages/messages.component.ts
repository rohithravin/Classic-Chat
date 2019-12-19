import { Component, OnInit, Inject, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpService }  from '../http.service';
import { LoginModel } from '../models/login-model';
import { PreviewChatModel } from '../models/preview-chat-model';
import { NewMessageModel } from '../models/new-message-model';
import { MessageModel } from '../models/message-model';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountModel } from '../models/account-model';
import * as CryptoJS from 'crypto-js';
import { interval, Subscription } from 'rxjs';




@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;

  selectedChat:string;
  animal: string;
  name: string;
  hideData:boolean;
  showData:boolean;
  current_user_id:number;
  current_user_account:AccountModel;

  current_messages:any;

  preview_groupchats:any;

  new_message:string;
  subscription: Subscription;

  new_group_name:string;
  new_group_usernames:string;
  new_group_message:string;


  constructor( private _router:Router, private _httpService:HttpService,private _snackBar: MatSnackBar, public dialog: MatDialog,  private activaterouter:ActivatedRoute,) {
    this.selectedChat = 'chat_0';
    this.hideData = true;
    this.showData = false;
    this.new_group_name = '';
    this.new_group_usernames= '';
    this.new_group_message= '';
    const source = interval(1000);

    this.current_messages = [];
    this.preview_groupchats = [];
    this.new_message = "";
    this.subscription = source.subscribe(val => this.GetNewMessages());

  }

  ngOnDestroy() {
  this.subscription.unsubscribe();
}

  GetNewMessages(){
    if (this.current_messages.length > 0){
      var id = this.current_messages[0].groupid

      var err=this._httpService.getMessages(id);
      err.subscribe(data=>{
        if (data['success'] == 1){
          if (this.current_messages.length != data['data'].length){
            this.current_messages = []
            for (var x = data['data'].length - (data['data'].length - this.current_messages.length ); x < data['data'].length; x++ ){
              this.current_messages.push(new MessageModel(data['data'][x].FIRST_NAME,data['data'][x].LAST_NAME, data['data'][x].GROUP_NAME, data['data'][x].MESSAGE ,data['data'][x].GROUP_ID ) )
            }
            console.log(this.current_messages)
            this.scrollToBottom();
          }
        }
        else{
          this._snackBar.open('Server Error: Couldn\' Get Group Messages.', 'Close', {
            verticalPosition: 'top',
            duration: 2000
          });
        }
      })

    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }

  SendMessage(){
    if (this.current_messages.length > 0){
      console.log(this.new_message)
      console.log(this.current_messages[0].groupid)
      console.log(this.current_user_id)

      var err=this._httpService.sendMessage([this.new_message,this.current_messages[0].groupid,this.current_user_id]);
      err.subscribe(data=>{
        if (data['success'] == 1){
          this.new_message = "";
        }
        else{
          this._snackBar.open('Couldn\'t Send Your Messages. Try Again.', 'Close', {
            verticalPosition: 'top',
            duration: 2000
          });
        }
      })
    }
    else{
      this.new_message = "";
    }

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
            localStorage.setItem("Current User Name", this.current_user_account.username)


            var err=this._httpService.getChatRoomsForUser(this.current_user_id);
            err.subscribe(data=>{
              if (data['success'] == 1){
                console.log(data)


                if (data['data'].length>0){

                          var list = []
                          for (var x = 0; x < data['data'].length; x++){
                            list.push(data['data'][x].GROUP_ID)
                            this.preview_groupchats.push(new PreviewChatModel(data['data'][x].GROUP_NAME, "", "", "" , data['data'][x].GROUP_ID,data['data'][x].IS_GROUP_CHAT))
                          }

                          this.preview_groupchats.sort(function(obj1, obj2) {
                              return obj1.group_id - obj2.group_id;
                          });



                          var err=this._httpService.getRecentMessage(list);
                          err.subscribe(data=>{
                            if (data['success'] == 1){


                              data['data'].sort(function(obj1, obj2) {
                                  return obj1.GROUP_ID - obj2.GROUP_ID;
                              });



                              for (var x = 0; x < data['data'].length;x++){
                                  this.preview_groupchats[x].recent_message_user = data['data'][x].FIRST_NAME
                                  if (data['data'][x].MESSAGE.length > 15){
                                    this.preview_groupchats[x].recent_message = data['data'][x].MESSAGE.substring(0,15) + " ..."
                                  }
                                  else{
                                    this.preview_groupchats[x].recent_message = data['data'][x].MESSAGE
                                  }
                                  this.preview_groupchats[x].recent_message_timestamp = data['data'][x].CREATED_DATE
                              }


                              this.ChangeMessageView(this.preview_groupchats[0].group_id)



                              //this.selectedChat = 'chat_' + this.preview_groupchats[0].group_id.toString()
                              this.hideData = false;
                              this.showData = true;
                              this._snackBar.open('Login Sucessful!', 'Close', {
                                verticalPosition: 'top',
                                duration: 2000
                              });
                            }
                            else{

                              this._snackBar.open('Couldn\'t Load Your Messages. Try Again.', 'Close', {
                                verticalPosition: 'top',
                                duration: 2000
                              });

                            }
                          })
                        }
                  else{
                    //this.selectedChat = 'chat_' + this.preview_groupchats[0].group_id.toString()
                    this.hideData = false;
                    this.showData = true;
                    this._snackBar.open('Login Sucessful!', 'Close', {
                      verticalPosition: 'top',
                      duration: 2000
                    });
                  }
              }
              else{
                this._snackBar.open('Couldn\'t Find Your Account. Try Logging In Again.', 'Close', {
                  verticalPosition: 'top',
                  duration: 2000
                });
              }
            })

          }else{
            this._snackBar.open('Couldn\'t Find Your Account. Try Logging In Again.', 'Close', {
              verticalPosition: 'top',
              duration: 2000
            });
          }
        })
      })
  }


  ChangeMessageView(group_id){
    if (this.selectedChat.substring(this.selectedChat.indexOf('_')+1) != group_id) {
      this.current_messages = []

      console.log(group_id)
      var err=this._httpService.getMessages(group_id);
      err.subscribe(data=>{
        if (data['success'] == 1){
          console.log(data['data'])
          for (var x = 0; x < data['data'].length; x++ ){
            this.current_messages.push(new MessageModel(data['data'][x].FIRST_NAME,data['data'][x].LAST_NAME, data['data'][x].GROUP_NAME, data['data'][x].MESSAGE ,data['data'][x].GROUP_ID ) )
          }
          console.log(this.current_messages)
          this.scrollToBottom();
          this.selectedChat = 'chat_' + group_id
        }
        else{
          this._snackBar.open('Server Error: Couldn\' Get Group Messages.', 'Close', {
            verticalPosition: 'top',
            duration: 2000
          });
        }
      })

    }



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
  usernames:string;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewMessageModel, private _snackBar: MatSnackBar, private _httpService:HttpService) {
      this.errGroupName = false;
      this.errUsernames= false;
      this.errMessage= false;
      this.usernames = "";
      this.data = new NewMessageModel([localStorage.getItem("Current User Name")],"","")

    }


  onNoClick(): void {
    if (this.data.groupname == '')
      this.errGroupName = true;
    else
      this.errGroupName = false;
    if (this.usernames == '')
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
      var list = this.usernames.split(",")
      var err=this._httpService.getUserIDS(list.concat(this.data.usernames));
      err.subscribe(data=>{
        console.log("response:", data);
        if (data['success'] == 1){
          this.data.usernames = data['data']
          var err=this._httpService.createNewChatRoom(this.data);
          err.subscribe(data=>{
            console.log("response:", data);
            if (data['success'] == 1){
              this._snackBar.open('Group Chat Created!', 'Close', {
                verticalPosition: 'top',
                duration: 2000
              });
              this.dialogRef.close();
              console.log(data)
            }
            else{
              this._snackBar.open('Server Error: Couldn\' Create Group Message.', 'Close', {
                verticalPosition: 'top',
                duration: 2000
              });
              console.log(data)
            }
          })
        }
        else{
          this._snackBar.open('USER ERROR: Some Usernames Don\'t Exist', 'Close', {
            verticalPosition: 'top',
            duration: 2000
          });
        }
      })
    }
  }



}
