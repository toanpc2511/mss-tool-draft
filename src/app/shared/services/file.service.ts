import { skipWhile, map } from 'rxjs/operators';
import {
	HttpClient,
	HttpEventType,
	HttpParams,
	HttpRequest,
	HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

export enum EFileType {
	IMAGE = 'IMAGE',
	OTHER = 'OTHER'
}

export interface IFile {
	id?: number;
	name: string;
	url?: string;
}

export interface IUploadProgress {
	loaded: number;
	total: number;
	type: HttpEventType;
}

@Injectable({
	providedIn: 'root'
})
export class FileService {
	constructor(
		private http: HttpService,
		private httpClient: HttpClient,
		private toastr: ToastrService
	) {}

	downloadFile(fileId: string, fileName: string) {
		const params = new HttpParams().set('file-id', fileId);
		return this.httpClient
			.get(`${environment.apiUrl}/files/downloads`, {
				params,
				observe: 'response',
				responseType: 'blob'
			})
			.subscribe(
				(res) => {
					saveAs(res.body, fileName);
				},
				() => this.toastr.error('Bạn không có quyền tải file này')
			);
	}

	downloadFromUrl(fileUrl: string) {
		window.open(fileUrl, '_blank');
	}

	uploadFile(fileFormData: FormData, type: EFileType) {
		return this.http.postUpload<Array<IFile>>(
			`${environment.apiUrl}/products/upload-image`,
			fileFormData,
			type
		);
	}

	uploadImage(body: FormData) {
		const params = new HttpParams().set('type', 'IMAGE').set('callApiType', 'background');
		const request = new HttpRequest('POST', environment.apiUrl, body, {
			reportProgress: true,
			responseType: 'json',
			params
		});

		return this.httpClient.request(request).pipe(
			map((response: any) => {
				if (response.type === HttpEventType.Response) {
					const data = { imageUrl: response.body.data[0].url };
					const init = { body: data };
					const res = new HttpResponse({ body: data });
					return res;
				}
			}),
			skipWhile((x) => !x)
		);
	}
}
