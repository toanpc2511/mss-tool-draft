import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

const ERROR_MESSAGE: Map<string, string> = new Map();
ERROR_MESSAGE.set('SUN-OIL-4241', 'Tên cột đã tồn tại');
ERROR_MESSAGE.set('SUN-OIL-4248', 'Tên trạm xăng đã tồn tại');
ERROR_MESSAGE.set('SUN-OIL-4249', 'Mã trạm xăng đã tồn tại');
ERROR_MESSAGE.set('SUN-OIL-4013', 'Mã trạm xăng không hợp lệ');
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  listErrorForDisplay = ['SUN-OIL-4248', 'SUN-OIL-4249'];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status >= 500) {
          this.toastr.error('Hệ thống đang bận! Vui lòng thử lại sau');
        }

        if (err.status === 400) {
          const message = ERROR_MESSAGE.get(err.error.meta?.code);

          const checkErr = this.listErrorForDisplay.includes(err.error.meta?.code);
          if (checkErr) {
            return throwError(err.error);
          }

          if (message) {
            this.toastr.error(message);
          }
        }

        if (err.status === 404) {
          Swal.fire('Not found!');
          this.router.navigate(['/']);
        }

        if (err.status === 401) {
          this.authService.logout();
        }

        const error = err.error.error;
        return throwError(error);
      })
    );
  }
}
