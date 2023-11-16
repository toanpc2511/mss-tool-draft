
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }
  createSignature(request: any): Observable<any> {
    const formRequest = new FormData();
    formRequest.append('dto', new Blob([JSON.stringify(request.dto)], {
      type: 'application/json',
    }));
    formRequest.append('file', request.file);
    return this.http.post<any>(`${environment.apiUrl}/attachment/signature/create`, formRequest);
  }

  UpdateSignature(request: any): Observable<any> {
    const formRequest = new FormData();
    formRequest.append('dto', new Blob([JSON.stringify(request.dto)], {
      type: 'application/json',
    }));
    formRequest.append('file', request.file);
    return this.http.post<any>(`${environment.apiUrl}/attachment/signature/update`, formRequest);
  }

}
