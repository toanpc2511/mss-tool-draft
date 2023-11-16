import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import {concatMap, switchMap} from 'rxjs/operators';
import { DataResponse } from '../models/data-response.model';
import {EFileType} from "./file.service";
import {T} from "@angular/cdk/keycodes";

export type HttpOptions = {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
};
@Injectable({ providedIn: 'root' })
export class HttpService {
  userInfo: any;
  now = moment().format('DD/MM/yyyy_HH:mm:ss.SSS');

  constructor(private httpClient: HttpClient) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  get<T>(
    endPoint: string,
    options?: {
      headers?:
      | HttpHeaders
      | {
        [header: string]: string | string[];
      };
      params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      withCredentials?: boolean;
    }
  ): Observable<DataResponse<T>> {
    options.headers = { ...options.headers, clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}` };

    return this.httpClient.get(`${endPoint}`, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }

  post<T>(
    endPoint: string,
    body: any,
    options?: {
      headers?:
      | HttpHeaders
      | {
        [header: string]: string | string[];
      };
      params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      withCredentials?: boolean;
    }
  ): Observable<DataResponse<T>> {
    options.headers = { ...options.headers, clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}` };

    return this.httpClient
      .post(`${endPoint}`, body, options)
      .pipe(
        switchMap((response) => {
          const res = new DataResponse<T>(response);
          return of(res);
        })
      );
  }

  put<T>(
    endPoint: string,
    body: any,
    options?: {
      headers?:
      | HttpHeaders
      | {
        [header: string]: string | string[];
      };
      params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      withCredentials?: boolean;
    }
  ): Observable<DataResponse<T>> {
    options.headers = { ...options.headers, clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}` };

    return this.httpClient
      .put(`${endPoint}`, body, options)
      .pipe(
        switchMap((response) => {
          const res = new DataResponse<T>(response);
          return of(res);
        })
      );
  }

  delete<T>(
    endPoint: string,
    options?: {
      headers?:
      | HttpHeaders
      | {
        [header: string]: string | string[];
      };
      params?:
      | HttpParams
      | {
        [param: string]: string | string[];
      };
      body?: any;
      reportProgress?: boolean;
      withCredentials?: boolean;
    }
  ): Observable<DataResponse<T>> {
    options.headers = { ...options.headers, clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}` };
    return this.httpClient.delete(`${endPoint}`, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }

  postUpload<T>(url: string, body: any): Observable<DataResponse<T>> {
    const request = new HttpRequest('POST', url, body, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({clientMessageId: `${this.userInfo.userName}-${moment().format('DD/MM/yyyy_HH:mm:ss.SSS')}`})
    });
    return this.httpClient.request(request).pipe(
      concatMap((response: any) => {
        if (response.type === HttpEventType.Response) {
          const res = response.body;
          return of(res);
        }
        return of(null);
      })
    );
  }
}
