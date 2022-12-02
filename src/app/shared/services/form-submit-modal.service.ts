import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormSubmitModalService {
  url!: string;
  message!: string;
  private display: BehaviorSubject<'open' | 'close'> = new BehaviorSubject<'open' | 'close'>('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open(message: string, url: string) {
    this.message = message;
    this.url = url;
    this.display.next('open');
  }

  close() {
    this.display.next('close');
  }
}
