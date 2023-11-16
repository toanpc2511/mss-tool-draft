import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../_services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CardPendingService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getListCardPending(obj: any): Observable<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/exportCard/list`, obj)
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        }, catchError(this.errorHandler.handleError))
      );
  }

  // exportCard(obj: any): Observable<any> {
  //   return this.http
  //     .post<any>(`${environment.apiUrl}/card/exportCard/exportXml`, obj)
  //     .pipe(map(data => {
  //       console.log(data);
  //       return data;
  //     }, catchError(this.errorHandler.handleError)));
  // }

  public exportCard(body: any): Observable<any> {
    // Create url
    const abc = this.http.post(
      `${environment.apiUrl}/card/exportCard/exportXml`,
      body,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        // headers: new HttpHeaders().append('Content-Type', 'application/xml')
      }
    );
    abc.subscribe((res) => {
      console.log('res', res);
    });
    return abc;
  }

  public printSuggestion(body: any): Observable<any> {
    // Create url
    return this.http.post(
      `${environment.apiUrl}/card/exportCard/exportSummary`,
      body,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        // headers: new HttpHeaders().append('Content-Type', 'application/xml')
      }
    );
  }

  public printDetail(body: any): Observable<any> {
    // Create url
    return this.http.post(
      `${environment.apiUrl}/card/exportCard/exportDetail`,
      body,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        // headers: new HttpHeaders().append('Content-Type', 'application/xml')
      }
    );
  }
}
