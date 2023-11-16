import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { saveAs } from 'file-saver';
import {CustomNotificationService} from './custom-notification.service';
import * as moment from 'moment/moment';
import { IError } from '../models/error.model';
import { FormMessageService } from './form-message.service';

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
  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private toastr: CustomNotificationService,
    private formMessageService: FormMessageService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.header = {
      ...this.header,
      clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}`
    };
  }

  downloadFile(urlPath: string, body?: any, fileName?: string): any {
    return this.httpClient.post<any>(`${environment.apiUrl}/${urlPath}`, body,
      {
        headers: {...this.header},
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe((res) => {
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }

        saveAs(res.body, fileName);
      }, () => this.formMessageService.openMessageError('Đã có lỗi xảy ra, vui lòng thử lại sau'));
  }

  downloadFileMethodGet(urlPath: string, params?: any, fileName?: string): any {
    return this.httpClient.get<Blob>(`${environment.apiUrl}/${urlPath}`,
      {
        headers: {...this.header},
        params,
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe((res) => {
        const contentDisposition = res.headers.get('content-disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }

        saveAs(res.body, fileName);
      }, (error: IError) => this.formMessageService.handleError(error));
  }

  downloadFromUrl(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }

  uploadFile(url: string, fileFormData: FormData): any {
    return this.http.postUpload<Array<File>>(`${environment.apiUrl}/${url}`, fileFormData);
  }

  handleValueFilter(conditions): string {
    const arr = [];
    const arrKeyOl = [];
    let valueKeyOl = '';
    const arrKeyOeq = [];
    let valueKeyOeq = '';
    let keyIn = '';
    const valueKeyIn = [];
    let keyNin = '';
    const valueKeyNin = [];
    // console.log(conditions);
    conditions.forEach((item) => {
      if (item.value) {
        switch (item.operator) {
          case 'ol':
            arrKeyOl.push(item.property);
            valueKeyOl = item.value;
            break;
          case 'oeq':
            arrKeyOeq.push(item.property);
            valueKeyOeq = item.value;
            break;
          // case 'in':
          //   keyIn = item.property;
          //   valueKeyIn.push(item.value);
          //   break;
          case 'nin':
            keyNin = item.property;
            valueKeyNin.push(item.value);
            break;
          default:
            arr.push(`${item.property}|${item.operator}|${item.value}`);
            break;
        }
      }
    });
    if (arrKeyOl.length > 0) {
      arr.push(`${arrKeyOl.join(',')}|ol|${valueKeyOl}`);
    }
    if (arrKeyOeq.length > 0) {
      arr.push(`${arrKeyOeq.join(',')}|oeq|${valueKeyOeq}`);
    }
    // if (keyIn && valueKeyIn.length > 0) {
    //   arr.push(`${keyIn}|in|${valueKeyIn.join(',')}`);
    // }
    if (keyNin && valueKeyNin.length > 0) {
      arr.push(`${keyNin}|nin|${valueKeyNin.join(',')}`);
    }
    // console.log(arr);
    return arr.join('&');
  }

}
