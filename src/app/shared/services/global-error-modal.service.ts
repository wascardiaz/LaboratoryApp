import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorModalService {

  error!: string | null;

  constructor() { }

  private display: BehaviorSubject<'open' | 'close'> = new BehaviorSubject<'open' | 'close'>('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open(error: string) {
    this.error = error;
    this.display.next('open');
  }

  close() {
    this.error = null;
    this.display.next('close');
  }
}
