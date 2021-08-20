import { HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

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
	constructor(private http: HttpService) {}

	downloadFile(urlFile: string) {
		window.open(urlFile, '_blank');
	}

	uploadFile(fileFormData: FormData, type: EFileType) {
		return this.http.postUpload<Array<IFile>>(
			`${environment.apiUrlRoot}/files`,
			fileFormData,
			type
		);
	}
}
