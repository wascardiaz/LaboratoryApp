import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public resetPasswordData = new BehaviorSubject<any>(null);
  public loggedInUser = new BehaviorSubject<User | null>(null);

  constructor() {

    const acnt = sessionStorage.getItem('user');

    if (acnt)
      this.loggedInUser = new BehaviorSubject<User | null>(JSON.parse(acnt));
    else
      this.loggedInUser = new BehaviorSubject<User | null>(null);
  }
}
