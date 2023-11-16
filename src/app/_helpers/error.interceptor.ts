import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { CustomNotificationService } from "../shared/services/custom-notification.service";
import { FormMessageService } from '../shared/services/form-message.service';


@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private notify: CustomNotificationService, private formMessageService: FormMessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                if (!request.headers.get('clientmessageid') || err.error.error === 'invalid_token') {
                    this.authenticationService.logout();
                }
                let message = err.error.error_description;
                let title = err.error.error;
                if (!message) {
                    message = "Bạn không có quyền truy cập vào tài nguyên của hệ thống";
                    title = "permission_denied";
                }
                this.formMessageService.openMessageError(message, title);
                //this.notify.error(err.error.error, err.error.error_description);
                //location.reload(true);
            }

            if (request.headers.get("clientmessageid")) {
                if (err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === "application/json") {
                    return new Promise<any>((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onload = (e: Event) => {
                            try {
                                const errmsg = JSON.parse((<any>e.target).result);
                                reject(errmsg.meta)
                            } catch (e) {
                                reject((err));
                            }
                        };
                        reader.onerror = (e) => {
                            reject(err);
                        };
                        reader.readAsText(err.error);
                    });
                }

                const error = err.error.meta
                return throwError(error);
            }
            const error = err.error?.message || err.statusText;
            return throwError(error);
        }))
    }
}
