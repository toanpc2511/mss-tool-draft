import {Injectable} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {LpbDialogService} from '../../../../shared/services/lpb-dialog.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {environment} from '../../../../../environments/environment';
import { saveAs } from 'file-saver';
import * as moment from 'moment/moment';
import {ISchool} from '../../../lpb-tuition-service/shared/models/tuition.interface';

@Injectable({
  providedIn: 'root',
})
export class MuaBanNTKHDNService{
  private baseUrl = `${environment.apiUrl}/kpi-service`;
  // private baseUrl = 'http://localhost:8080';
  header: any;
  userInfo: any;
  now = moment().valueOf();

  constructor(
    private http: HttpService,
    private dialogService: LpbDialogService,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private toastr: CustomNotificationService) {
    this.dialogService.setDialog(this.dialog);
  }

  uploadFile(url: string, fileFormData: FormData): any {
    return this.http.postUpload<any>(`${this.baseUrl}/${url}`, fileFormData);
  }

  saveFile(url: string, fileFormData: FormData): any {
    return this.http.postUpload<any>(`${this.baseUrl}/${url}`, fileFormData);
  }

  downloadFileMethodGet(urlPath: string, params?: any, fileName?: string): any {
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

  searchHo(urlPath: string, date: string, status: string, statusCn: string): any  {
    const params = new HttpParams()
      .set('date', date)
      .set('status', status)
      .set('statusCn', statusCn);
    return this.http.get<ISchool[]>(`${this.baseUrl}/${urlPath}`, {
      params
    });
  }

  downloadFileReportHO(urlPath: string, date: string, status: string, statusCn: string, fileName?: string): any {
    const param = {date, status, statusCn};
    return this.httpClient.get<Blob>(`${this.baseUrl}/${urlPath}`,
      {
        headers: {...this.header},
        params: param,
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

  searchDVKD(urlPath: string, date: string, status: string, statusCn: string, type: string): any  {
    const params = new HttpParams()
      .set('date', date).set('status', status).set('statusCn', statusCn).set('type', type);
    return this.http.get<ISchool[]>(`${this.baseUrl}/${urlPath}`, {
      params
    });
  }

  downloadReportForDVKD(urlPath: string, date: string, status: string, statusCn: string, type: string, fileName?: string): any {
    const params = new HttpParams()
      .set('date', date).set('status', status).set('statusCn', statusCn).set('type', type);
    return this.httpClient.get<ISchool[]>(`${this.baseUrl}/${urlPath}`,
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

  // tslint:disable-next-line:max-line-length
  downloadFileBc(urlPath: string, date: string, branchCode: string, typeBC: string, getAll: string, typeFile: string, fileName?: string): any {
    const param = {date, branchCode, typeBC, getAll, typeFile};
    return this.httpClient.get<Blob>(`${this.baseUrl}/${urlPath}`,
      {
        headers: {...this.header},
        params: param,
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
}
