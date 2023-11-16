import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerHandlerService } from '../services/spinner-handler.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(public spinnerHandler: SpinnerHandlerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let isSpinnerURL = !request.headers.get('x-skip-spinner');
    if (isSpinnerURL) {
      this.spinnerHandler.setLoading(true, request.url);
    } else {
      // Bỏ x-skip-spinner
      this.spinnerHandler.setSkipSpinner(request.url);
      request = request.clone({
        headers: request.headers.delete('x-skip-spinner', 'true'),
      });
    }

    return next.handle(request).pipe(
      finalize(() => {
        if(isSpinnerURL){
          this.spinnerHandler.setLoading(false, request.url);
        }
      })
    );
  }
}
