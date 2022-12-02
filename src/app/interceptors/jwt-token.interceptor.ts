import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.authService.fetchFromSessionStorage()?.jwtToken;
    // Null will still add a token 
    if (token !== undefined)
      authReq = request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`)

        // .append('access-control-allow-origin', '*')
        // .append('Access-Control-Allow-Headers', 'authorization')
        // .append('Access-Control-Allow-Methods', "*"),
      });
    return next.handle(authReq);
  }
}
