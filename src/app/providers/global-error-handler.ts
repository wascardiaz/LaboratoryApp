import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { ErrorDialogService } from "../shared/services/error-dialog.service";
import { GlobalErrorModalService } from "../shared/services/global-error-modal.service";
import { LoadingService } from "../shared/services/loading.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // constructor(private errorDialogService: ErrorDialogService,
  //   private loadingService: LoadingService) { }

  // handleError(error: Error) {
  //   console.log(error)
  //   this.loadingService.disableLoading();
  //   this.errorDialogService.openDialog(
  //     error.message || 'Error de cliente indefinido'
  //   );
  // }

  constructor(
    private modalService: GlobalErrorModalService,
    private loadingService: LoadingService
  ) { }

  handleError(error: Error) {
    this.loadingService.disableLoading();
    // Only shows error which are not related to http
    if (!(error instanceof HttpErrorResponse)) this.modalService.open(error.message || 'Error de cliente indefinido');
  }
}