import {HttpService} from '../../../../shared/services/http.service';
import {LpbDialogService} from '../../../../shared/services/lpb-dialog.service';
import {MatDialog} from '@angular/material/dialog';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { saveAs } from 'file-saver';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {IBills} from '../../../lpb-water-service/shared/models/water.interface';
import * as moment from 'moment';
import {ISchool} from '../../../lpb-tuition-service/shared/models/tuition.interface';
import {HTTPMethod} from "../../../../shared/constants/http-method";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root',
})
export class PhiBaoHiemNhanThoService{
  private baseUrl = `${environment.apiUrl}/kpi-service`;
  //private baseUrl = 'http://localhost:8080';
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
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.header = {
      ...this.header,
      clientMessageId: `${this.userInfo.userName}-${this.now}`
    };
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

  downloadFile(urlPath: string, body?: any, fileName?: string): any {
    debugger
    return this.httpClient.post<any>(`${this.baseUrl}/${urlPath}`, body,
      {
        headers: {...this.header},
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe(
        (res) => {
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }

        saveAs(res.body, fileName);
      }, (res) =>
      {
        if (res.code === "kpi-service-00-4002"){
          this.toastr.warning('Thông báo', 'Không có dữ liệu !')
        }else{
          this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
        }
      }
      );
  }

  downloadFileReport(urlPath: string, date: string, status: string, fileName?: string): any {
    const param = {date, status};
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

  search2(urlPath: string, date: string, status: string): any  {
    const params = new HttpParams()
      .set('date', date)
      .set('status', status);
    return this.http.get<ISchool[]>(`${this.baseUrl}/${urlPath}`, {
      params
    });
  }

  searchDVKD(urlPath: string, date: string, status: string, statusCn: string): any  {
    const params = new HttpParams()
      .set('date', date).set('status', status).set('statusCn', statusCn );
    return this.http.get<ISchool[]>(`${this.baseUrl}/${urlPath}`, {
      params
    });
  }

  downloadReportForDVKD(urlPath: string, date: string, status: string, statusCn: string, fileName?: string): any {
    const params = new HttpParams()
      .set('date', date).set('status', status).set('statusCn', statusCn);
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

  CallAPI(urlPath: string, body?: any, options?: any): any {
    let method = options.method;
    let obs: Observable<any>;
    let httpOptions = { headers: {...this.header}, observe: 'response', responseType: 'json'};
    let url = `${this.baseUrl}/${urlPath}`
    if (method === HTTPMethod.GET) {
      obs = this.httpClient.get(url, { headers: {...this.header}, observe: 'response', responseType: 'json'});
    } else if (method === HTTPMethod.POST) {
      obs = this.httpClient.post<any>(url, body, { headers: {...this.header}, observe: 'response', responseType: 'json'});
    } else if (method === HTTPMethod.PUT) {
      obs = this.httpClient.put<any>(url, body, { headers: {...this.header}, observe: 'response', responseType: 'json'});
    } else if (method === HTTPMethod.PATCH) {
      obs = this.httpClient.patch(url, body, { headers: {...this.header}, observe: 'response', responseType: 'json'});
    } else if (method === HTTPMethod.DELETE) {
      obs = this.httpClient.delete(url, { headers: {...this.header}, observe: 'response', responseType: 'json'});
    }

    return obs.subscribe(
        (successData) => {
          options.success(successData);
        },
        (er)=>{
          options.error(er);
        }
      );
  }


}
