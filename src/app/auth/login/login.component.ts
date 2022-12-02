import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService
  ) { }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.redirectIfLoggedIn();
    this.initForm();
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) this.submitData(this.loginForm.value);
  }

  submitData(formData: any) {
    this.loadingService.enableLoading();
    this.loginSubscription = this.authService.login(formData).subscribe(
      (response) => {
        this.router.navigate(['/dashboard']);
        this.loadingService.disableLoading();
      },
      (error) => {
        this.loadingService.disableLoading();
        if (error.error.message === 'FieldException')
          error.error.errors.forEach((element: any) =>
            this.loginForm.controls[element.field]?.setErrors({
              serverValidationError: element.message,
            })
          );
        else throw new Error(error);
      }
    );
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.loginForm.controls }

}
