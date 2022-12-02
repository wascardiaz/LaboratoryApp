import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RequestQuestionComponent } from './request-question/request-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ChangePasswordComponent,
    RequestQuestionComponent,
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class AuthModule { }
