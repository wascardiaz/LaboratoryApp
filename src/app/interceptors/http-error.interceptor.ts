import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorDialogService } from '../shared/services/error-dialog.service';
import { AuthService } from '../shared/services/auth.service';
import { GlobalErrorModalService } from '../shared/services/global-error-modal.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  // constructor(private errorDialogService: ErrorDialogService, private authService: AuthService) { }

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   return next.handle(request).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if ([401, 403].includes(error.status) && this.authService.userValue) {
  //         // auto logout if 401 or 403 response returned from api
  //         this.authService.logout();
  //         // return of(err);
  //       }
  //       if (error?.error?.message !== 'FieldException')
  //         this.errorDialogService.openDialog(
  //           error.error.message ? error.error.message : error.error ?? JSON.stringify(error),
  //           error.status
  //         );
  //       return throwError(error);
  //     })
  //   );
  // }

  constructor(private modalService: GlobalErrorModalService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.error?.message !== 'FieldException') // Ignore for Validation error
          this.handleErrorResponse(error);
        return throwError(error);
      })
    );
  }

  handleErrorResponse(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error('Evento de error');
      } else {
        switch (error.status) {
          case 404:
            this.modalService.open('Error 404: Servicio no listo');
            break;
          case 403:
            this.modalService.open('Error 403: Acceso denegado');
            break;
          case 500:
            this.modalService.open("Error 500: el servidor no pudo procesar la solicitud, vuelva a intentarlo");
            break;
          default:
            this.modalService.open(`Error ${error.status} ${error.error.message ? error.error.message : error.error ?? JSON.stringify(error)}`)
        }
      }
    } else {
      console.error('algo mas paso');
    }
  }
}
