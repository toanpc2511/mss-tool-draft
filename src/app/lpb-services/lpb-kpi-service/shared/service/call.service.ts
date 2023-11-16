import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {NotificationService} from '../../../../_toast/notification_service';
import {HTTPMethod} from '../../../../shared/constants/http-method';
import {environment} from "../../../../../environments/environment";
import {HttpService} from "../../../../shared/services/http.service";

@Injectable({
  providedIn: 'root'
})
export class CallService {
  @Output() progressEvent: EventEmitter<boolean> = new EventEmitter();
  uriTest = `${environment.apiUrl}/kpi-service/`;
  // uriTest = 'http://localhost:8080/';
  constructor(private readonly http: HttpClient,
              private httpService: HttpService,
              private notificationService: NotificationService) { }

  // tslint:disable-next-line:typedef
  callApi(options: any) {
    const method = options.method;
    let url = '';
    url = `${this.uriTest}` + options.url;
    const data = options.data;
    let progress = options.progress;
    if (progress === undefined) {
      progress = false;
    }
    if (progress) {
      // Show progress
      this.progressEvent.emit(true);
    }
    let obs: Observable<any>;
    const httpOptions = {
      headers: this.buildHttpHeaders('application/json'),
    };

    if (method === HTTPMethod.GET) {
      obs = this.http.get(url, httpOptions);
    } else if (method === HTTPMethod.POST) {
      obs = this.http.post(url, JSON.stringify(data), httpOptions);
    } else if (method === HTTPMethod.PUT) {
      obs = this.http.put(url, JSON.stringify(data), httpOptions);
    } else if (method === HTTPMethod.PATCH) {
      obs = this.http.patch(url, JSON.stringify(data), httpOptions);
    } else if (method === HTTPMethod.DELETE) {
      obs = this.http.delete(url, httpOptions);
    }

    let timeoutSeconds = 90;
    if (options.timeoutSeconds) {
      timeoutSeconds = options.timeoutSeconds;
    }

    obs.pipe(timeout(1000 * timeoutSeconds)).subscribe(
      (successData) => {
        if (typeof options.success === 'function') {
          if (progress) {
            // Hide progress
            this.progressEvent.emit(false);
          }
          options.success(successData);
        }
      },
      (errorData) => {
        if (progress) {
          // Hide progress
          this.progressEvent.emit(false);
        }

        if (errorData.status === 504) {
          this.notificationService.showError('Timeout', 'Thông báo');
        }
        if (errorData.status === 401) {
          this.notificationService.showError('Quá thời gian truy cập', 'Thông báo');
        } else if (typeof options.error === 'function') {
          options.error(errorData);
        } else {
          this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
        }
      }
    );
  }

  // tslint:disable-next-line:typedef
  private buildHttpHeaders(contentType) {
    const headers = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    return new HttpHeaders(headers);
  }

  uploadFile(url: string, fileFormData: FormData): any {
    return this.httpService.postUpload<any>(`${this.uriTest}${url}`, fileFormData);
  }
}
