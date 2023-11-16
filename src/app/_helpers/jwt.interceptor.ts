import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';
import {environment} from 'src/environments/environment';
import {SpinnerOverlayService} from "../_services/spinner-overlay.service";
import {finalize} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private readonly spinnerOverlayService: SpinnerOverlayService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    // const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.access_token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.access_token}`
        }
      });
    }

    // return next.handle(request).pipe(finalize(() => spinnerSubscription.unsubscribe()));
    return next.handle(request);
  }
}
