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
import { IError } from '../models/error.model';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private router: Router,
		private toastr: ToastrService,
		private authService: AuthService
	) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
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
					Swal.fire('Không tồn tại!', null, 'error');
					this.router.navigate(['/']);
				}

				if (err.status === 401 && this.authService.getCurrentUserValue()) {
					if (
						errors.code === 'base-cms-4812' ||
						errors.code === 'base-cms-4823' ||
						errors.code === 'base-cms-4852'
					) {
						this.toastr.error('Tài khoản của bạn đã bị xoá. Không thể thực hiện được');
					}
					if (errors.code === 'base-cms') {
						this.toastr.error(
							'Tài khoản của bạn vừa được chỉnh nhóm quyền, vui lòng đăng nhập lại'
						);
					}
					if (errors.code === 'base-cms-4008') {
						this.toastr.error('Bạn cần đăng nhập lại để truy cập nội dung này');
					}
					this.authService.logout().subscribe();
				}

				const error = err.error.error;
				return throwError(error);
			})
		);
	}
}
