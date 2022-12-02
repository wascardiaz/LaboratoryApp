import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { RequestQuestionComponent } from './request-question/request-question.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'forgotpassword', component: RequestQuestionComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
      // { path: 'register', component: SignupComponent },
      // { path: 'register', component: SignupComponent },
      // { path: 'forgot-password', component: ForgotPasswordComponent },
      // { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', redirectTo: '/404' },
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
