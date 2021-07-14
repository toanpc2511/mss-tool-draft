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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.toastr.error('Bad request!');
        }
        
        if (err.status >= 500) {
          this.toastr.error('Hệ thống đang bận! Vui lòng thử lại sau');
        }

        if (err.status === 404) {
          Swal.fire('Not found!');
          this.router.navigate(['/']);
        }

        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
        }

        const error = err.error.error;
        return throwError(error);
      })
    );
  }
}
