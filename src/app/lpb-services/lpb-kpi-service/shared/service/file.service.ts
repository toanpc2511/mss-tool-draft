import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {saveAs} from 'file-saver';
import * as moment from 'moment/moment';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {HttpService} from '../../../../shared/services/http.service';

export enum EFileType {
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  header: any;
  userInfo: any;
  now = moment().valueOf();
  private baseUrl = `${environment.apiUrl}/kpi-service`;
  // private baseUrl = 'http://localhost:8080';
  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private toastr: CustomNotificationService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.header = {
      ...this.header,
      clientMessageId: `${this.userInfo.userName}-${this.now}`
    };
  }

  downloadFile(urlPath: string, body?: any, fileName?: string): any {
    return this.httpClient.post<any>(`${this.baseUrl}/${urlPath}`, body,
      {
        headers: {...this.header},
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe((res) => {
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['']/g, '');
          }
        }

        saveAs(res.body, fileName);
      },(mes) => {
        if (mes.message.includes('00-99'))
        this.toastr.error('Lỗi', mes.message);
        else this.toastr.warning('Thông báo', mes.message);
      });
  }
  saveFile(url: string, fileFormData: FormData): any {
    return this.http.postUpload<any>(`${this.baseUrl}/${url}`, fileFormData);
  }
  downloadFileMethodGet(urlPath: string, params?: any, fileName?: string): any {
    // return this.httpClient.get<Blob>(`${environment.apiUrl}/${urlPath}`, TOODO
    return this.httpClient.get<Blob>(`${this.baseUrl}/${urlPath}`,
      {
        headers: {...this.header},
        params,
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe((res) => {
        const contentDisposition = res.headers.get('content-disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['']/g, '');
          }
        }

        saveAs(res.body, fileName);
      }, () => this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau'));
  }

  downloadFromUrl(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }
}
