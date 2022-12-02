import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-request-question',
  templateUrl: './request-question.component.html',
  styleUrls: ['./request-question.component.scss']
})
export class RequestQuestionComponent implements OnInit {
  requestQuestionForm!: FormGroup;
  formSubscription!: Subscription;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService,
    private eventService: EventService
  ) {}

  ngOnDestroy(): void {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.initQuestionForm();
  }

  requestSecretQuestion() {
    this.submitted = true;
    if (this.requestQuestionForm.valid)
      this.submitData(this.requestQuestionForm.value.username);
  }

  submitData(formData:any) {
    this.loadingService.enableLoading();
    this.formSubscription = this.authService
      .requestSecretQuestion(formData)
      .subscribe(
        (response:any) => {
          this.loadingService.disableLoading();
          this.eventService.resetPasswordData.next(response);
          this.router.navigateByUrl('/login/changepassword');
        },
        (error:any) => {
          this.loadingService.disableLoading();
          if (error.error.message === 'FieldException')
            error.error.errors.forEach((element:any) =>
              this.requestQuestionForm.controls[element.field]?.setErrors({
                serverValidationError: element.message,
              })
            );
          else throw new Error(error);
        }
      );
  }

  initQuestionForm() {
    this.requestQuestionForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
    });
  }

}
