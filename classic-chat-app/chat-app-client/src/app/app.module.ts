import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MessagesComponent } from './messages/messages.component';
import { DialogOverviewExampleDialog } from './messages/messages.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material';
import { HttpService } from './http.service';
import {BrowserAnimationsModule} from  '@angular/platform-browser/animations';
import {Md5} from 'ts-md5/dist/md5';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SignInComponent,
    SignUpComponent,
    MessagesComponent,
    DialogOverviewExampleDialog

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  exports:[
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  entryComponents: [
   DialogOverviewExampleDialog
  ],
  providers: [HttpService, Md5],
  bootstrap: [AppComponent]

})
export class AppModule { }
