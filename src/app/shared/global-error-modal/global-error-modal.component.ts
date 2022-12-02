import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalErrorModalService } from '../services/global-error-modal.service';

@Component({
  selector: 'app-global-error-modal',
  templateUrl: './global-error-modal.component.html',
  styleUrls: ['./global-error-modal.component.scss']
})
export class GlobalErrorModalComponent implements OnInit {
  display$!: Observable<'open' | 'close'>;
  error!: string | null;

  constructor(private modalService: GlobalErrorModalService) { }

  ngOnInit() {
    this.display$ = this.modalService.watch();
    this.openSubscription();
  }
  openSubscription() {
    this.display$.subscribe((res) => (this.error = this.modalService.error));
  }

  close() {
    this.modalService.close();
  }

}
