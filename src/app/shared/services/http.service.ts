import {
	HttpClient,
	HttpEventType,
	HttpHeaders,
	HttpParams,
	HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, switchMap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataPush } from '../models/data-push.model';
import { DataResponse } from '../models/data-response.model';
import { EFileType } from './file.service';

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
	apiUrl = environment.apiUrl;

	constructor(private httpClient: HttpClient) {}

	private makeRequest(
		method: 'GET' | 'PUT' | 'POST' | 'DELETE',
		url: string,
		options: HttpOptions
	) {
		return this.httpClient.request(method, url, options).pipe(timeout(15000));
	}

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

	getFileUrl<T>(
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
				const res = new DataResponse<T>(response, true);
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

	postUpload<T>(url: string, body: any, type: EFileType): Observable<DataResponse<T>> {
		const params = new HttpParams().set('type', type).set('callApiType', '');
		const request = new HttpRequest('POST', url, body, {
			reportProgress: true,
			responseType: 'json',
			params
		});

		return this.httpClient.request(request).pipe(
			concatMap((response: any) => {
				if (response.type === HttpEventType.Response) {
					const res = new DataResponse<T>(response.body);
					return of(res);
				}
				return of(response);
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
