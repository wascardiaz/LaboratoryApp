import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormSubmitModalService } from '../services/form-submit-modal.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-form-submit-modal',
  templateUrl: './form-submit-modal.component.html',
  styleUrls: ['./form-submit-modal.component.scss']
})
export class FormSubmitModalComponent implements OnInit {
  display$!: Observable<'open' | 'close'>;
  message!: string;

  constructor(
    private modalService: FormSubmitModalService,
    public loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.display$ = this.modalService.watch();
    this.openSubscription();
  }
  openSubscription() {
    this.display$.subscribe((res) => {
      this.message = this.modalService.message;
    });
  }

  close() {
    this.modalService.close();
    this.router.navigateByUrl(this.modalService.url);
  }

}
