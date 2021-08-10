import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataPush } from '../models/data-push.model';
import { DataResponse } from '../models/data-response.model';

@Injectable({ providedIn: 'root' })
export class HttpService {
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  customGet<T>(
    url: string,
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
    return this.httpClient.get(url, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
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
    return this.httpClient.get(`${this.apiUrl}/${endPoint}`, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }

  customPost<T>(
    url: string,
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
    const bodyOrigin = new DataPush(body);
    return this.httpClient.post(url, bodyOrigin.data, options).pipe(
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
    const bodyOrigin = new DataPush(body);
    return this.httpClient.post(`${this.apiUrl}/${endPoint}`, bodyOrigin.data, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }

  customPut<T>(
    url: string,
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
    const bodyOrigin = new DataPush(body);
    return this.httpClient.put(url, bodyOrigin.data, options).pipe(
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
    const bodyOrigin = new DataPush(body);
    return this.httpClient.put(`${this.apiUrl}/${endPoint}`, bodyOrigin.data, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }

  customDelete<T>(
    url,
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
    return this.httpClient.delete(url, options).pipe(
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
      reportProgress?: boolean;
      withCredentials?: boolean;
    }
  ): Observable<DataResponse<T>> {
    return this.httpClient.delete(`${this.apiUrl}/${endPoint}`, options).pipe(
      switchMap((response) => {
        const res = new DataResponse<T>(response);
        return of(res);
      })
    );
  }
}
