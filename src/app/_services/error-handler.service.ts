import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs/internal/observable/throwError';
import {NotificationService} from '../_toast/notification_service';
import {ResponseStatus} from '../_models/response';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private notificationService: NotificationService) { }
  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    // console.log('tétttt', error);

    if (error.error instanceof ErrorEvent) {
      // console.log('client');
      // client-side error/ loi phia client
      errorMessage = `Error: ${error.error.message}`;
      this.showError(error.error.message);

    } else {
      // console.log('server');
      // server-side error/ loi phia server
      errorMessage = `Server Error\nError Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error.error_description === 'close') {
        errorMessage = 'Tài khoản đã bị đóng';
      } else if (error.error.error_description === 'lock') {
        errorMessage = 'Tài khoản đã bị khóa';
      } else {
        errorMessage = 'Thông tin đăng nhập không đúng';
      }
      // this.showError("dsadsa");
    }
    return throwError(errorMessage);
  }

  messageHandler(response: ResponseStatus, successAction: string): void {
    if (response) {
      if (response.success === true) {
        this.notificationService.showSuccess(successAction, 'Thông báo');
      } else {
        if (response.codes) {
          response.codes.map(
            code => {
              const errorMsg = code.detail.length > 92 ? code.detail.substr(0, 92) : code.detail;
              this.notificationService.showError(errorMsg, 'Thông báo');
            }
          );
        }
      }
    }
  }
  showError(errorMessage: string): void {
    if (errorMessage === 'No message available' || errorMessage === 'Unknown Error' || errorMessage === null) {
      this.notificationService.showError('Lỗi không xác định', 'Thông báo');
    }
    else { this.notificationService.showError(errorMessage, 'Thông báo'); }
  }
  showSuccess(successMessage: string): void {
    this.notificationService.showSuccess(successMessage, 'Thông báo');
  }
  showErrorMessageList(response: ResponseStatus): void {
    if (response.success === false) {
      if (response.codes) {
        response.codes.map(
          code => {
            const errorMsg = code.detail + ': ' + code.msg;
            this.notificationService.showError(errorMsg, 'Thông báo');
          }
        );
      }else { this.notificationService.showError('Lỗi không xác định', 'Thông báo'); }
    }
  }
}
