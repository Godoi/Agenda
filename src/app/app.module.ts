import { BrowserModule } from '@angular/platform-browser';
import { NgModule,Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { fakeBackendProvider } from './_helpers/fk-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { NgbdDatepickerConfig } from './calendar/calendar-component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AlertComponent } from './_directives/alert.component';

import { AlertService } from './_service/alert.service';
import { AuthenticationUserService } from './_service/authenticationUser.service';
import { AuthenticationCalendarService } from './_service/authenticationCalendar.service';
import { UserService } from './_service/user.service';
import { CalendarService } from './_service/calendar.service';

import{AuthGuard} from './_guards/auth.guard';
import{routing} from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,    
    NgbdDatepickerConfig,
    SidebarComponent
  ],
  imports: [
    NgbModule.forRoot(),
    JsonpModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing   
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationUserService,
    AuthenticationCalendarService,
    UserService,
    CalendarService,
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
