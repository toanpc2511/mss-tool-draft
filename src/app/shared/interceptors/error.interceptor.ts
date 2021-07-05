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
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private translateService: TranslateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 400) {
          alert('Bad request');
        }

        if (err.status === 500) {
          alert('');
        }

        if (err.status === 404) {
          Swal.fire( this.translateService.instant('NOT_LOGGED'));
          this.router.navigate(['/']);
        }

        if (err.status === 401) {
          this.router.navigate(['/']);
        }

        const error = err.error.error;
        return throwError(error);
      })
    );
  }
}
