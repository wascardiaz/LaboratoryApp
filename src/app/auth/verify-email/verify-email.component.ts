import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  token!: string;

  public verifiedEmail: boolean = false;
  public verifyPercentage: number = 0;
  public timer: any;

  private dialogConfig: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    // private errorService: ErrorHandlerService,
    private dialog: MatDialog,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.onSubmit();
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
  }

  public checkChanged = (event: any) => {
    this.verifiedEmail = event.checked;
    this.verifiedEmail ? this.startTimer() : this.stopTimer();
  }

  private startTimer = () => {
    this.timer = setInterval(() => {
      this.verifyPercentage += 1;
      if (this.verifyPercentage === 100) {
        this.onSubmit();
        clearInterval(this.timer);
      }
    }, 30);
  }

  private stopTimer = () => {
    clearInterval(this.timer);
    this.verifyPercentage = 0;
  }

  private onSubmit() {
    this.authService.verifyEmail(this.token)
      .pipe(first())
      .subscribe(
        (response) => {
          this.router.navigate(['/dashboard']);
          this.loadingService.disableLoading();
        },
        (error) => {
          this.emailStatus = EmailStatus.Failed;
          this.loadingService.disableLoading(); throw new Error(error);

        });
  }

}
