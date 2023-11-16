import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const errors: IError = err.error.meta;
        if (err.status >= 500) {
          this.toastr.error('Hệ thống đang bận! Vui lòng thử lại sau');
        }

        if (err.status === 400) {
          return throwError(errors);
        }

        if (err.status === 404) {
          this.toastr.error('Không tồn tại !');
        }

        const error = err.error.error;
        return throwError(error);
      })
    );
  }
}
