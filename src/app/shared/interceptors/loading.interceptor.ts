import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  count = 0;

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { params } = request;

    if (params.get('callApiType') !== 'background') {
      if (this.count === 0) {
        this.spinner.show();
      }
      this.count++;
      return next.handle(request).pipe(
        finalize(() => {
          this.count--;
          if (this.count === 0) {
            this.spinner.hide();
          }
        })
      );
    }
    return next.handle(request);
  }
}
