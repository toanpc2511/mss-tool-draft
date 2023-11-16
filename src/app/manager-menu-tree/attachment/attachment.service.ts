import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) { }

  createAttachment(request: any): Observable<any> {
    const formRequest = new FormData();
    formRequest.append('dto', new Blob([JSON.stringify(request.dto)], {
      type: 'application/json',
    }));
    formRequest.append('file', request.file);
    return this.http.post<any>(`${environment.apiUrl}/attachment/attachment/create`, formRequest);
  }

  UpdateAttachment(request: any): Observable<any> {
    const formRequest = new FormData();
    formRequest.append('dto', new Blob([JSON.stringify(request.dto)], {
      type: 'application/json',
    }));
    formRequest.append('file', request.file);
    return this.http.post<any>(`${environment.apiUrl}/attachment/attachment/update`, formRequest);
  }

}
