import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EventService } from './event.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authServiceUrl = `${environment.protocol}${environment.applicationUrl}/${environment.authService}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private eventServie: EventService
  ) { }

  public get userValue(): User | null {
    return this.eventServie.loggedInUser.value;
  }

  login(formData: any) {
    return this.http
      .post(`${this.authServiceUrl}/signin`, formData)
      .pipe(tap((user: User) => {
        this.saveToSessionStorage(user);
        this.eventServie.loggedInUser.next(user);
      }));
  }

  saveToSessionStorage(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  fetchFromSessionStorage(): User {
    let user = sessionStorage.getItem('user');
    if (user)
      return JSON.parse(user);
    return {};
  }

  refreshToken(): Observable<User> {
    let user = sessionStorage.getItem('user');
    let token = null;
    if (user)
      token = JSON.parse(user).refreshToken;

    if (!(user && token)) return of(token);

    return this.http.post<any>(`${this.authServiceUrl}/refreshtoken`, { refreshToken: token }, { withCredentials: true })
      .pipe(map((newToken: any) => {
        const user = JSON.parse(sessionStorage.getItem('user') || '');
        if (newToken && newToken.jwtToken) {
          user.jwtToken = newToken.jwtToken;
          user.refreshToken = newToken.refreshToken;
          this.saveToSessionStorage(user);
          this.eventServie.loggedInUser.next(user);
          this.startRefreshTokenTimer();
        }

        return user;
      }));
  }

  verifyEmail(token: string) {
      return this.http.post(`${this.authServiceUrl}/verify-email`, { token });
  }

  logout(): void {
    let rToken: any = sessionStorage.getItem('user');
    if (rToken)
      rToken = JSON.parse(rToken).refreshToken;

    this.http.post<any>(`${this.authServiceUrl}/signout`, { token: rToken }, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    sessionStorage.clear();
    localStorage.clear();
    this.eventServie.loggedInUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  redirectIfLoggedIn() {
    if (this.fetchFromSessionStorage()?.jwtToken)
      this.router.navigate(['/dashboard']);
  }

  isAuthenticated(): boolean {
    const token = this.fetchFromSessionStorage()?.jwtToken;
    return !this.jwtHelper.isTokenExpired(token);
  }

  requestSecretQuestion(username: string) {
    return this.http.get(`${this.authServiceUrl}/forgotpassword/${username}`);
  }

  requestPasswordReset(formData: any) {
    return this.http.put(`${this.authServiceUrl}/forgotpassword`, formData);
  }

  getRole() {
    return this.fetchFromSessionStorage()?.role;
  }

  // helper methods

  private refreshTokenTimeout: any;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const tmp = this.userValue?.jwtToken?.split('.')[1] || '';

    // let jwtToken;
    const jwtToken = JSON.parse(atob(tmp));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    // console.log('jwtToken: ' + jwtToken, '\nexpires: ' + expires, '\ntimeout: ' + timeout, '\nrefreshTokenTimeout: ' + this.refreshTokenTimeout)
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
